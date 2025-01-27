from decimal import Decimal

from rest_framework import serializers

from products.models import Product
from products.serializers import ProductSerializer

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(
        read_only=True,
        fields=[
            "id",
            "name",
            "slug",
            "price",
            "discount_price",
            "stock",
            "image",
            "has_discount",
        ],
    )
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        source="product",
    )
    total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_id", "quantity", "total"]

    def validate(self, attrs):
        """Check that product quantity exceeds available product stock."""

        product = attrs.get("product")
        quantity = attrs.get("quantity", 1)
        if quantity > product.stock:
            raise serializers.ValidationError(
                {"quantity": "Quantity exceeds available stock."}
            )
        return attrs

    def get_total(self, obj) -> Decimal:
        return obj.get_total()


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    original_price = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    delivery_charge = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "user",
            "items",
            "original_price",
            "discounted_price",
            "discount_percentage",
            "delivery_charge",
            "subtotal",
            "total",
            "created_at",
        ]

    def get_original_price(self, obj) -> Decimal:
        return obj.original_price()

    def get_discounted_price(self, obj) -> Decimal:
        return obj.discounted_price()

    def get_discount_percentage(self, obj) -> Decimal:
        return obj.discount_percentage()

    def get_delivery_charge(self, obj) -> Decimal:
        return obj.delivery_charge()

    def get_subtotal(self, obj) -> Decimal:
        return obj.subtotal()

    def get_total(self, obj) -> Decimal:
        return obj.total()
