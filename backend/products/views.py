import logging

from django.db.models import Q
from django.http import Http404
from rest_framework import filters
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from config.pagination import CustomLimitOffsetPagination
from users.models import UserRole
from users.permissions import IsAdmin, IsAdminOrReadOnly
from vendors.permissions import IsVendor

from .filters import ProductFilter
from .models import Category, Product, Review
from .permissions import IsProductVendorOwnerOrReadOnly, IsReviewOwnerOrReadOnly
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ReviewSerializer,
    UserReviewSerializer,
)

logger = logging.getLogger(__name__)


class CategoryListView(ListCreateAPIView):
    """List all categories, or create a new category."""

    queryset = Category.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ["created_at"]
    search_fields = ["name"]


class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a category."""

    queryset = Category.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = CategorySerializer
    lookup_field = "slug"
    lookup_url_kwarg = "category_slug"


from django_filters.rest_framework import DjangoFilterBackend


class ProductListView(ListCreateAPIView):
    """List all products, or create a new product."""

    queryset = (
        Product.objects.all()
        .select_related("category", "vendor")
        .order_by("-created_at")
    )
    serializer_class = ProductSerializer
    pagination_class = CustomLimitOffsetPagination
    parser_classes = [FormParser, MultiPartParser]
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    filterset_class = ProductFilter
    # filterset_fields = ['category']
    ordering_fields = ["price", "stock", "created_at"]
    search_fields = ["name"]

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.is_authenticated and user.is_admin:
            # list all products for admin users
            queryset = queryset.reviews_annotations(all_reviews=True)
        else:
            # list only Active and Discontinued products for non-admin/anonymous users
            queryset = queryset.filter(
                Q(status=Product.Status.ACTIVE) | Q(status=Product.Status.DISCONTINUED)
            ).reviews_annotations(all_reviews=False)

        return queryset


# TODO: cache the view
class ProductStatusChoicesView(APIView):
    """Retrieve status choices of a Product model."""

    def get(self, request, *args, **kwargs):
        status_choices = [
            {"value": value, "label": label} for value, label in Product.Status.choices
        ]
        return Response({"choices": status_choices})


class ProductDetailView(RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a product."""

    queryset = Product.objects.all().select_related("vendor__user")
    permission_classes = [IsProductVendorOwnerOrReadOnly | IsAdmin]
    serializer_class = ProductSerializer
    parser_classes = [FormParser, MultiPartParser]
    lookup_field = "slug"
    lookup_url_kwarg = "product_slug"

    def get_object(self):
        obj = super().get_object()
        user = self.request.user

        # check if the product is in Draft or Inactive status
        statuses = [Product.Status.DRAFT, Product.Status.INACTIVE]
        if obj.status in statuses:
            if user.is_anonymous:
                raise NotFound
            # allow access to admin users or vendor owner of the product
            if user.is_admin or obj.vendor.user == user:
                return obj
            raise PermissionDenied

        return obj  # Allow access for other status products

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.is_authenticated and user.is_admin:
            queryset = queryset.reviews_annotations(all_reviews=True)
        else:
            queryset = queryset.reviews_annotations(all_reviews=False)
        return queryset


class ReviewListView(ListCreateAPIView):
    """List all reviews, or create a new review."""

    queryset = (
        Review.objects.all()
        .select_related("product", "user")
        .only(
            "id",
            "product__id",
            "product__name",
            "product__slug",
            "user__id",
            "user__first_name",
            "user__last_name",
            "rating",
            "comment",
            "is_active",
            "created_at",
            "updated_at",
        )
    )
    filterset_fields = ["rating"]
    pagination_class = CustomLimitOffsetPagination

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.request.user.is_admin:
            return ReviewSerializer
        return UserReviewSerializer

    def perform_create(self, serializer):
        if self.request.user.is_admin:
            serializer.save()
        else:
            serializer.save(user=self.request.user)


class ReviewDetailView(RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a review."""

    queryset = (
        Review.objects.all()
        .select_related("product", "user")
        .only(
            "id",
            "product__id",
            "product__name",
            "product__slug",
            "user__id",
            "user__first_name",
            "user__last_name",
            "rating",
            "comment",
            "is_active",
            "created_at",
            "updated_at",
        )
    )
    serializer_class = ReviewSerializer
    permission_classes = [IsReviewOwnerOrReadOnly | IsAdmin]
    lookup_url_kwarg = "review_id"

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if obj.is_active == False:
            if user.is_anonymous:
                raise NotFound
            if obj.user == user or user.is_admin:
                return obj
            # if user is not review owner or admin, deny access
            raise PermissionDenied
        return obj

    # def get_serializer_class(self):
    # if self.request.user.is_admin:
    # return ReviewSerializer
    # return UserReviewSerializer


class ProductReviewListView(ListAPIView):
    """List all reviews of a product."""

    serializer_class = ReviewSerializer
    pagination_class = CustomLimitOffsetPagination
    # permission_classes = [AllowAny]
    filterset_fields = ["rating"]

    def get_queryset(self):
        """
        - Admin can view all reviews of a product.
        - Vendor owner can view all reviews of their products.
        - Customer and Guest users can view only active reviews of a product.
        """
        user = self.request.user
        product_slug = self.kwargs.get("product_slug")

        queryset = Review.objects.select_related("product", "user").defer(
            "product__description",
            "product__image",
            "user__role",
            "user__password",
            "user__is_superuser",
            "user__last_login",
            "user__is_staff",
            "user__is_active",
            "user__date_joined",
        )

        if user.is_authenticated:
            if user.is_admin:
                queryset = queryset.filter(product__slug=product_slug)
            elif user.is_vendor:
                queryset = queryset.filter(
                    product__slug=product_slug, product__vendor__user=user
                )
            else:
                queryset = queryset.filter(product__slug=product_slug, is_active=True)
        else:
            queryset = queryset.filter(product__slug=product_slug, is_active=True)

        return queryset
