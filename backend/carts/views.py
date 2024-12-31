from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import CartItemSerializer, CartSerializer


class CartListView(ListCreateAPIView):
    queryset = Cart.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = CartSerializer


class CartDetailView(generics.RetrieveAPIView):
    pass


class UserCartView(APIView):
    """
    View to retrieve request user's cart.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddToCartView(APIView):
    """Add product to the cart."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer._validated_data["product"]
        quantity = serializer._validated_data.get("quantity", 1)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            # If the item already exists, update the quantity
            cart_item.quantity += quantity
            cart_item.save()
        return Response(
            {"message": "Product added successully."}, status=status.HTTP_201_CREATED
        )


class RemoveFromCartView(APIView):
    """Remove product from the cart."""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk, *args, **kwargs):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, pk=pk)
        cart_item.delete()
        return Response(
            {"message": "Product removed successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class IncrementCartItemQuantityView(APIView):
    def patch(self, request, pk, *args, **kwargs):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, pk=pk)
        # Check if the incremented quantity exceeds the stock
        # add 1 to the current quantity to simulate the increment
        if cart_item.quantity + 1 > cart_item.product.stock:
            return Response(
                {"quantity": "Quantity exceeds available stock."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        cart_item.quantity += 1
        cart_item.save()
        return Response(
            {
                "message": "Product quantity incremented successfully.",
                "quantity": cart_item.quantity,
            },
            status=status.HTTP_200_OK,
        )


class DecrementCartItemQuantityView(APIView):
    def patch(self, request, pk, *args, **kwargs):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, pk=pk)
        if cart_item.quantity <= 1:
            return Response(
                {
                    "message": "Cannot decrement quantity. Minimum quantity is 1.",
                    "quantity": cart_item.quantity,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        cart_item.quantity -= 1
        cart_item.save()
        return Response(
            {
                "message": "Product quantity decremented successfully.",
                "quantity": cart_item.quantity,
            },
            status=status.HTTP_200_OK,
        )
