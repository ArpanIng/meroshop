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

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


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
    price = models.PositiveIntegerField(
        help_text="Price of the product.",
    )
    discount_price = models.PositiveIntegerField(
        null=True, blank=True, help_text="Discount price of the product."
    )
    stock = models.PositiveIntegerField(help_text="Stock quantity.")
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

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if self.stock == 0:
            self.status = Product.Status.OUT_OF_STOCK
        super().save(*args, **kwargs)
