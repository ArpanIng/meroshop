import logging

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from users.models import CustomUser, UserRole
from users.serializers import DynamicFieldsModelSerializer, UserSerializer

from .models import Vendor

logger = logging.getLogger(__name__)


class UserVendorSerializer(serializers.ModelSerializer):
    """Vendor serializer for regular user."""

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


class VendorSerializer(DynamicFieldsModelSerializer):
    """Vendor serializer for admin user."""

    user = UserSerializer(
        read_only=True,
        fields=["id", "first_name", "last_name", "email"],
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        validators=[
            UniqueValidator(
                queryset=Vendor.objects.all(),
                message="vendor with this user already exists.",
            )
        ],
        write_only=True,
        source="user",
    )

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
            "user_id",
            "created_at",
            "updated_at",
        ]

    def validate_user_id(self, value):
        """Check that the user has the 'Vendor' role."""
        if value.role != UserRole.VENDOR:
            raise serializers.ValidationError("User must have the role of 'Vendor'.")
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # self.fields is None - serializer includes all fields by default
        # only display the field if 'fields' is None or is explicitly included in 'fields' when initializing the serializer
        # if self.fields is None or "status" in self.fields:
        #     # return the label of the choice instead of value.
        #     data["status"] = instance.get_status_display()

        data["status"] = instance.get_status_display()
        return data
