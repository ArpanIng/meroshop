from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsAdminOrReadOnly

from .models import Vendor
from .serializers import VendorSerializer


class VendorListView(ListCreateAPIView):
    queryset = Vendor.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = VendorSerializer


class VendorStatusChoicesView(APIView):
    """View to retrieve status choices of a Vendor model."""

    def get(self, request, *args, **kwargs):
        status_choices = [
            {"value": value, "label": label} for value, label in Vendor.Status.choices
        ]
        return Response({"choices": status_choices}, status=status.HTTP_200_OK)


class VendorDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
