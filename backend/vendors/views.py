from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from users.permissions import IsAdminOrReadOnly

from .models import Vendor
from .serializers import VendorSerializer


class VendorListView(ListCreateAPIView):
    queryset = Vendor.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = VendorSerializer


class VendorDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
