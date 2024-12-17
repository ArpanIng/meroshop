from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser

from users.permissions import IsAdmin, IsAdminOrReadOnly

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryListView(ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.all()
        # filtering based on query parameters
        search_query = self.request.query_params.get("q")
        if search_query is not None:
            queryset = queryset.filter(name__icontains=search_query)
        return queryset


class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = CategorySerializer


class ProductListView(ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
