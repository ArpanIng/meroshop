import logging

from rest_framework import filters
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import SAFE_METHODS, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from config.pagination import CustomLimitOffsetPagination
from users.permissions import IsAdmin, IsAdminOrReadOnly
from vendors.permissions import IsVendor

from .models import Category, Product
from .permissions import IsProductVendorOwnerOrReadOnly
from .serializers import CategorySerializer, ProductSerializer

logger = logging.getLogger(__name__)


class CategoryListView(ListCreateAPIView):
    """List all categories, or create a new category."""

    queryset = Category.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a category."""

    queryset = Category.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = CategorySerializer
    lookup_field = "slug"
    lookup_url_kwarg = "category_slug"


class ProductListView(ListCreateAPIView):
    """List all products, or create a new product."""

    queryset = Product.objects.all().select_related("category", "vendor")
    serializer_class = ProductSerializer
    pagination_class = CustomLimitOffsetPagination
    parser_classes = [FormParser, MultiPartParser]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdmin | IsVendor]
        return [permission() for permission in permission_classes]


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

    queryset = Product.objects.all().select_related("category", "vendor")
    permission_classes = [IsProductVendorOwnerOrReadOnly | IsAdmin]
    serializer_class = ProductSerializer
    parser_classes = [FormParser, MultiPartParser]
    lookup_field = "slug"
    lookup_url_kwarg = "product_slug"
