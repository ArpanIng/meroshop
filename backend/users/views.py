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
    """View to display profile of the request user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
