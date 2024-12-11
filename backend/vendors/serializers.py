from rest_framework import serializers

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
