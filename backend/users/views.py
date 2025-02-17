from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .permissions import IsAdmin
from .serializers import UserRegistrationSerializer, UserSerializer


class UserListView(generics.ListAPIView):
    """View to list all users in the system."""

    permission_classes = [IsAdmin]
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = get_user_model().objects.all()
        role = self.request.query_params.get("role")
        if role is not None:
            queryset = queryset.filter(roll__exact=role)
        return queryset


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrive, update, or delete a user."""

    queryset = get_user_model().objects.all()
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer


class UserRegistrationView(generics.CreateAPIView):
    """View to register a new user."""

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


class ProfileView(generics.RetrieveUpdateAPIView):
    """Display profile of the request user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserReviewListView(generics.ListAPIView):
    """
    List all product reviews of the request authenticated user.
    If `user_id` is passed, list all user's product reviews of that ID.
    """

    queryset = Review.objects.all().select_related("user")
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["rating"]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        user_id = self.kwargs.get("user_id")

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        else:
            queryset = queryset.filter(user=user)
        # Apply filters manually for DjangoFilterBackend
        return self.filter_queryset(queryset)

    def get_permissions(self):
        self.permission_classes = [permissions.IsAuthenticated]

        if "user_id" in self.kwargs:
            self.permission_classes = [IsAdmin]
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        reviews = self.get_queryset()
        serializer = self.get_serializer(
            reviews,
            many=True,
            fields=[
                "id",
                "product",
                "rating",
                "comment",
                "is_active",
                "created_at",
                "updated_at",
            ],
        )
        return Response(serializer.data)
