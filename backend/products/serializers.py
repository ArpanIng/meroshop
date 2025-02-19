from decimal import Decimal

from rest_framework import serializers

from users.models import CustomUser
from users.serializers import DynamicFieldsModelSerializer
from vendors.models import Vendor
from vendors.serializers import VendorSerializer

from .models import Category, Product, Review


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
    rating = serializers.FloatField(read_only=True, source="avg")
    total_reviews = serializers.IntegerField(read_only=True)
    total_ratings = serializers.IntegerField(read_only=True, source="sum")
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
        return data


class ReviewSerializer(DynamicFieldsModelSerializer):
    product = serializers.ReadOnlyField(source="product.name")
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source="product"
    )
    user = serializers.ReadOnlyField(source="user.get_full_name")
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
