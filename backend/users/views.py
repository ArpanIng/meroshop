import logging

from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status
from rest_framework.generics import (
    ListAPIView,
    RetrieveUpdateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from config.pagination import CustomLimitOffsetPagination
from products.models import Review
from products.serializers import ReviewSerializer

from .permissions import IsAdmin
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)

logger = logging.getLogger(__name__)


class UserListView(ListAPIView):
    """List all users in the system."""

    queryset = get_user_model().objects.all().select_related("profile")
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer
    filterset_fields = ["role"]


class UserDetailView(RetrieveUpdateDestroyAPIView):
    """Retrive, update, or delete a user."""

    queryset = get_user_model().objects.all().select_related("profile")
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(APIView):
    """Register a new user."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(RetrieveUpdateAPIView):
    """Display profile of the request user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserReviewListView(ListAPIView):
    """
    List all product reviews of the request authenticated user.
    If `user_id` is passed, list all user's product reviews of the ID.
    """

    serializer_class = ReviewSerializer
    pagination_class = CustomLimitOffsetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["rating"]

    def get_queryset(self):
        queryset = Review.objects.select_related("product").only(
            "id",
            "product__id",
            "product__name",
            "product__slug",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        )
        user_id = self.kwargs.get("user_id")

        if user_id:
            queryset = queryset.filter(user=user_id)
        else:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    def get_permissions(self):
        if "user_id" in self.kwargs:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        serializer_fields = [
            "id",
            "product",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, fields=serializer_fields)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, fields=serializer_fields)
        return Response(serializer.data)
