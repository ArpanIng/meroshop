from rest_framework import serializers

from vendors.serializers import VendorSerializer

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "created_at", "updated_at"]
        read_only_fields = ["slug"]


class ProductSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source="get_status_display")
    has_discount = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()

    # Dynamically modifying fields
    def __init__(self, *args, **kwargs):
        self.fields_to_include = kwargs.pop("fields", None)
        super().__init__(*args, **kwargs)
        if self.fields_to_include is not None:
            # Drop any fields that are not specified in the `fields` argument.
            # fields - refers to a keyword argument passed when initializing the serializer
            allowed = set(self.fields_to_include)
            # self.fields - represents all the fields defined in the serializer
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

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
            "vendor",
            "status",
            "has_discount",
            "discount_percentage",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug"]

    def validate(self, attrs):
        if attrs["discount_price"] >= attrs["price"]:
            raise serializers.ValidationError(
                {
                    "discount_price": "Discount price cannot be greater than or equal to the original price.",
                }
            )
        return attrs

    def get_has_discount(self, obj):
        return obj.has_discount

    def get_discount_percentage(self, obj):
        return obj.discount_percentage

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if self.fields_to_include is None or "category" in self.fields_to_include:
            data["category"] = CategorySerializer(instance.category).data
        if self.fields_to_include is None or "vendor" in self.fields_to_include:
            data["vendor"] = VendorSerializer(instance.vendor).data
        return data
