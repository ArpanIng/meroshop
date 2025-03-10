from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify

from vendors.models import Vendor

from .managers import ProductManager


class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


def validate_positive_decimal(value):
    if value < 0:
        raise ValidationError("The price must be positive.")


class Product(models.Model):
    """Model representing a product."""

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"
        DISCONTINUED = "DISCONTINUED", "Discontinued"

    name = models.CharField(max_length=250)
    slug = models.SlugField(max_length=250, unique=True)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Original price of the product.",
        validators=[validate_positive_decimal, MinValueValidator(Decimal("10.0"))],
    )
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Discounted price of the product.",
        validators=[validate_positive_decimal, MinValueValidator(Decimal("10.0"))],
    )
    stock = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(1000)],
        help_text="Stock quantity.",
    )
    image = models.ImageField(
        upload_to="products/", default="default_product.jpg", blank=True
    )
    status = models.CharField(
        max_length=12,
        choices=Status.choices,
        default=Status.DRAFT,
        help_text="Select the status of the product.",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.RESTRICT,
        help_text="Assign category",
        related_name="products",
    )
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="products",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ProductManager()

    class Meta:
        indexes = [
            models.Index(fields=["name"]),
        ]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name

    def clean(self):
        if self.has_discount and self.discount_price >= self.price:
            raise ValidationError(
                {
                    "discount_price": "Discount price cannot be greater than or equal to the original price.",
                }
            )
        # Ensure the vendor's status is ACTIVE before allowing the product creation
        if self.vendor.status not in [Vendor.Status.ACTIVE]:
            raise ValidationError(
                {"vendor": "Product can only be created for active vendors."}
            )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def in_stock(self) -> bool:
        return self.status == Product.Status.ACTIVE and self.stock > 0

    @property
    def has_discount(self) -> bool:
        """Checks whether the product has a discount."""
        return self.discount_price is not None

    @property
    def selling_price(self) -> Decimal:
        """Returns the final selling price of the product."""
        return self.discount_price if self.has_discount else self.price

    @property
    def discounted_price(self) -> Decimal:
        """Returns the discounted price of the product if a discount is applied."""
        return (
            self.price - self.discount_price if self.has_discount else Decimal("0.00")
        )

    @property
    def discount_percentage(self) -> Decimal:
        """Returns the discount percentage if a discount is applied, else returns 0.0."""
        if self.has_discount:
            return round((self.discounted_price / self.price) * 100, 2)
        return Decimal("0.00")


class Review(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(max_length=1000)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["product", "user"], name="unique_product_user_review"
            )
        ]
        indexes = [
            models.Index(fields=["rating"]),
        ]

    def __str__(self):
        return f"Review by {self.user.email} on product {self.product.name}"
