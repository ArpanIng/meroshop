from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify

from vendors.models import Vendor


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


def validate_min_price(value):
    if value < 10:
        raise ValidationError()


class Product(models.Model):
    """Model representing a product."""

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"
        OUT_OF_STOCK = "OUT_OF_STOCK", "Out of Stock"
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
        default=Status.ACTIVE,
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

    class Meta:
        indexes = [
            models.Index(fields=["name"]),
        ]

    def __str__(self) -> str:
        return self.name

    def clean(self):
        if self.has_discount and self.discount_price >= self.price:
            raise ValidationError(
                {
                    "discount_price": "Discount price cannot be greater than or equal to the original price.",
                }
            )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        # set the product status based on the stock
        self.status = (
            Product.Status.OUT_OF_STOCK if self.stock == 0 else Product.Status.ACTIVE
        )
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def in_stock(self) -> bool:
        return self.stock > 0

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
