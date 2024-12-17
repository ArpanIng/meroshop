from rest_framework import serializers

from users.models import UserRole

from .models import Vendor


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            "id",
            "name",
            "description",
            "email",
            "address",
            "phone_number",
            "created_at",
            "updated_at",
        ]
