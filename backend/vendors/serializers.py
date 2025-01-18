from rest_framework import serializers

from users.models import UserRole
from users.serializers import UserSerializer

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
            "status",
            "user",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        user = attrs["user"]
        # ensure the user has the 'Vendor' role
        if user.role != UserRole.VENDOR:
            raise serializers.ValidationError(
                {"user": "User must have the role of 'Vendor'."}
            )
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # return the label of the choice instead of value.
        data["status"] = instance.get_status_display()
        data["user"] = UserSerializer(instance.user).data
        return data
