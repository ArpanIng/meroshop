# Generated by Django 4.2.18 on 2025-03-04 14:56

from decimal import Decimal
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import products.models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=150, unique=True)),
                ("slug", models.SlugField(max_length=150, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Category",
                "verbose_name_plural": "Categories",
            },
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=250)),
                ("slug", models.SlugField(max_length=250, unique=True)),
                ("description", models.TextField()),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2,
                        help_text="Original price of the product.",
                        max_digits=10,
                        validators=[
                            products.models.validate_positive_decimal,
                            django.core.validators.MinValueValidator(Decimal("10.0")),
                        ],
                    ),
                ),
                (
                    "discount_price",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        help_text="Discounted price of the product.",
                        max_digits=10,
                        null=True,
                        validators=[
                            products.models.validate_positive_decimal,
                            django.core.validators.MinValueValidator(Decimal("10.0")),
                        ],
                    ),
                ),
                (
                    "stock",
                    models.IntegerField(
                        help_text="Stock quantity.",
                        validators=[
                            django.core.validators.MinValueValidator(0),
                            django.core.validators.MaxValueValidator(1000),
                        ],
                    ),
                ),
                (
                    "image",
                    models.ImageField(
                        blank=True, default="default_product.jpg", upload_to="products/"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("DRAFT", "Draft"),
                            ("ACTIVE", "Active"),
                            ("INACTIVE", "Inactive"),
                            ("DISCONTINUED", "Discontinued"),
                        ],
                        default="DRAFT",
                        help_text="Select the status of the product.",
                        max_length=12,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "rating",
                    models.IntegerField(
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(5),
                        ]
                    ),
                ),
                ("comment", models.TextField(max_length=1000)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to="products.product",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
