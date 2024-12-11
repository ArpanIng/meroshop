from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import Vendor
from .serializers import VendorSerializer
from users.permissions import IsAdminOrReadOnly


class VendorListView(ListCreateAPIView):
    queryset = Vendor.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = VendorSerializer


class VendorDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
