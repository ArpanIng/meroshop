from rest_framework import status
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product
from products.serializers import ProductSerializer
from users.models import UserRole
from users.permissions import IsAdmin, IsAdminOrReadOnly

from .models import Vendor
from .permissions import IsVendor, IsVendorOwnerOrReadOnly
from .serializers import VendorSerializer


class VendorListView(ListCreateAPIView):
    """List all vendors, or create a new vendor."""

    queryset = Vendor.objects.all().select_related("user")
    serializer_class = VendorSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = self.request.user
        # Admins can create vendor by setting user manually
        if user.is_superuser and user.role == UserRole.ADMINISTRATOR:
            serializer.save()
        else:
            # current authenticated user is assigned as vendor user
            serializer.save(user=user)


class VendorStatusChoicesView(APIView):
    """Retrieve status choices of a Vendor model."""

    def get(self, request, *args, **kwargs):
        status_choices = [
            {"value": value, "label": label} for value, label in Vendor.Status.choices
        ]
        return Response({"choices": status_choices}, status=status.HTTP_200_OK)


class VendorDetailView(RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a vendor."""

    queryset = Vendor.objects.all().select_related("user")
    permission_classes = [IsVendorOwnerOrReadOnly | IsAdmin]
    serializer_class = VendorSerializer
