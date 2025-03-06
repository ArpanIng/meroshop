import logging

from django.shortcuts import get_object_or_404
from rest_framework import filters, status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from config.pagination import CustomLimitOffsetPagination
from products.models import Product
from products.serializers import ProductSerializer
from users.models import UserRole
from users.permissions import IsAdmin, IsAdminOrReadOnly

from .models import Vendor
from .permissions import IsVendor, IsVendorOwnerOrReadOnly
from .serializers import UserVendorSerializer, VendorSerializer

logger = logging.getLogger(__name__)


class VendorApplicationSubmitView(APIView):
    """
    view for submitting a vendor application for regular users.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = UserVendorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(
                {
                    "detail": "Your vendor application has been submitted successfully and is pending approval."
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VendorApplicationConfirmView(APIView):
    """view for confirming a vendor application."""

    permission_classes = [IsAdmin]

    def patch(self, request, vendor_id, *args, **kwargs):
        vendor = get_object_or_404(Vendor, id=vendor_id)
        if vendor.status != Vendor.Status.PENDING:
            return Response(
                {
                    "detail": "Vendor application cannot be confirmed as it is not in pending status."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        vendor.status = Vendor.Status.ACTIVE
        vendor.save()

        # Change user role to VENDOR
        if hasattr(vendor, "user"):  # ensure vendor has a user
            vendor.user.role == UserRole.VENDOR  # update role
            vendor.user.save()  # save user

        return Response(
            {
                "detail": f"Vendor {vendor.name} application has been confirmed and is now active."
            },
            status=status.HTTP_200_OK,
        )


class VendorListView(ListCreateAPIView):
    """List all vendors, or create a new vendor."""

    queryset = (
        Vendor.objects.all()
        .select_related("user")
        .defer(
            "user__password",
            "user__last_login",
            "user__is_superuser",
            "user__is_staff",
            "user__is_active",
            "user__date_joined",
            "user__role",
        )
    )
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at", "updated_at"]
    ordering = ["-created_at"]
    pagination_class = CustomLimitOffsetPagination

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = self.request.user
        if not user.is_admin:
            return Response(
                {
                    "detail": "Your vendor application has been submitted successfully and is pending approval."
                },
                status=status.HTTP_201_CREATED,
            )

        return response

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.request.user.is_admin:
            return VendorSerializer
        return UserVendorSerializer

    def perform_create(self, serializer):
        if self.request.user.is_admin:
            serializer.save()
        else:
            serializer.save(user=self.request.user)


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

    def get_object(self):
        obj = super().get_object()

        user = self.request.user
        statuses = [
            Vendor.Status.PENDING,
            Vendor.Status.SUSPENDED,
            Vendor.Status.REJECTED,
        ]
        if obj.status in statuses:
            if user.is_anonymous:
                raise NotFound
            if user.is_admin:
                return obj
            if obj.user != user:
                raise PermissionDenied
        return obj

    # def get_permissions(self):
    #     if self.request.method in SAFE_METHODS:
    #         permission_classes = [AllowAny]
    #     else:
    #         permission_classes = [IsVendorOwner]
    #     return [permission() for permission in permission_classes]

    # def get_serializer_class(self):
    # if self.request.user.is_admin:
    # return VendorSerializer
    # return UserVendorSerializer


class VendorProductListView(ListAPIView):
    """
    List all products for the currently authenticated vendor user.
    If `vendor_id` is passed, list all vendor's products of the ID.
    """

    queryset = (
        Product.objects.all()
        .select_related("category")
        .reviews_annotations(all_reviews=True)
    )
    pagination_class = CustomLimitOffsetPagination
    serializer_class = ProductSerializer

    # def get_permissions(self):
    #     # only admin users can view products of a specific vendor
    #     if "vendor_id" in self.kwargs:
    #         permission_classes = [IsAdmin]
    #     else:
    #         permission_classes = [IsVendor]
    #     return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        vendor_id = self.kwargs.get("vendor_id")

        vendor = get_object_or_404(Vendor, pk=vendor_id)

        if vendor_id:
            queryset = queryset.filter(vendor=vendor)
        else:
            queryset = queryset.filter(vendor__user=self.request.user)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        serializer_fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "discount_price",
            "stock",
            "image",
            "category",
            "rating",
            "total_reviews",
            "total_ratings",
            "has_discount",
            "discount_percentage",
            # "created_at",
            # "updated_at",
        ]

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, fields=serializer_fields)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, fields=serializer_fields)
        return Response(serializer.data, status=status.HTTP_200_OK)
