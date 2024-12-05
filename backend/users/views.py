from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .serializers import UserRegistrationSerializer, UserSerializer, ProfileSerializer
from .models import Profile


class UserListView(generics.ListAPIView):
    """List all users of the system."""

    queryset = get_user_model().objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserSerializer


class UserRegistrationView(generics.CreateAPIView):
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
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile


class UserProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProfileSerializer

    def get_object(self):
        username = self.kwargs.get('username')
        return Profile.objects.get(user__username=username)
