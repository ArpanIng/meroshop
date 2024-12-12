from django.contrib import admin


from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at", "updated_at"]
    prepopulated_fields = {
        "slug": [
            "name",
        ]
    }


admin.site.register(Product)