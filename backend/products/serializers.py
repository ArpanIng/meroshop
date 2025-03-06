import logging
from decimal import Decimal

from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from users.models import CustomUser
from users.serializers import DynamicFieldsModelSerializer, UserSerializer
from vendors.models import Vendor
from vendors.serializers import VendorSerializer

from .models import Category, Product, Review

logger = logging.getLogger(__name__)


class CategorySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "created_at", "updated_at"]
        read_only_fields = ["slug"]


class ProductSerializer(DynamicFieldsModelSerializer):
    category = CategorySerializer(read_only=True, fields=["id", "name", "slug"])
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source="category",
    )
    vendor = VendorSerializer(read_only=True, fields=["id", "name"])
    vendor_id = serializers.PrimaryKeyRelatedField(
        queryset=Vendor.objects.all(),
        write_only=True,
        source="vendor",
    )
    rating = serializers.FloatField(read_only=True, source="avg_rating")
    total_reviews = serializers.IntegerField(read_only=True, source="reviews_count")
    total_ratings = serializers.IntegerField(read_only=True, source="sum_rating")
    has_discount = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "discount_price",
            "stock",
            "image",
            "category",
            "category_id",
            "vendor",
            "vendor_id",
            "status",
            "rating",
            "total_reviews",
            "total_ratings",
            "has_discount",
            "discount_percentage",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug"]

    @classmethod
    def get_nested_fields(cls):
        return ["id", "name", "slug"]

    def validate(self, attrs):
        """
        Check that product discount price is less than the product original price.
        """

        # Check if discount_price is provided
        if "discount_price" in attrs and attrs["discount_price"] is not None:
            if attrs["discount_price"] >= attrs["price"]:
                raise serializers.ValidationError(
                    {
                        "discount_price": "Discount price cannot be greater than or equal to the original price.",
                    }
                )
        return attrs

    def get_has_discount(self, obj) -> bool:
        return obj.has_discount

    def get_discount_percentage(self, obj) -> Decimal:
        return obj.discount_percentage

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # self.fields is None - serializer includes all fields by default
        # only display the field if 'fields' is None or is explicitly included in 'fields' when initializing the serializer
        if self.fields is None or "status" in self.fields:
            # return the label of the choice instead of value.
            data["status"] = instance.get_status_display()

        # Serializer Context
        request = self.context.get("request")
        user = request.user
        # return serializer fields based on user role
        if user.is_anonymous or (user.is_authenticated and not user.is_admin):
            if "status" in data:
                del data["status"]
        return data


class UserReviewSerializer(serializers.ModelSerializer):
    """Review serializer for regular users."""

    class Meta:
        model = Review
        fields = ["id", "product", "rating", "comment", "created_at", "updated_at"]

    def validate(self, attrs):
        user = self.context.get("request").user
        product = attrs["product"]

        if Review.objects.filter(product=product, user=user).exists():
            raise serializers.ValidationError(
                "Review with this Product and User already exists.",
            )
        logger.info(f"review user: {user}")
        return attrs


class ReviewSerializer(DynamicFieldsModelSerializer):
    product = ProductSerializer(
        read_only=True, fields=ProductSerializer.get_nested_fields()
    )
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source="product"
    )
    user = UserSerializer(read_only=True, fields=UserSerializer.get_nested_fields())
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), write_only=True, source="user"
    )

    class Meta:
        model = Review
        fields = [
            "id",
            "product",
            "product_id",
            "user",
            "user_id",
            "rating",
            "comment",
            "is_active",
            "created_at",
            "updated_at",
        ]
        validators = [
            UniqueTogetherValidator(
                queryset=Review.objects.all(),
                fields=["product", "user"],
                message="Review with this Product and User already exists.",
            )
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        user = request.user
        if user.is_anonymous or (user.is_authenticated and not user.is_admin):
            if "is_active" in data:
                del data["is_active"]

        return data
