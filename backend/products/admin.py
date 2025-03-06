from django.contrib import admin

from .models import Category, Product, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at", "updated_at"]
    prepopulated_fields = {
        "slug": [
            "name",
        ]
    }


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "discount_price", "stock", "vendor", "status"]
    prepopulated_fields = {
        "slug": [
            "name",
        ]
    }


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        "product",
        "user",
        "rating",
        "is_active",
        "created_at",
        "updated_at",
    ]
