from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser, Profile


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "Role",
            {
                "fields": ("role",),
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": "wide",
                "fields": (
                    "first_name",
                    "last_name",
                    "username",
                    "email",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


admin.site.register(Profile)
