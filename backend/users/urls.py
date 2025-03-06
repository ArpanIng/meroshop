from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("token/", views.LoginView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/register/", views.UserRegistrationView.as_view()),
    path("users/", views.UserListView.as_view()),
    path("users/<int:pk>/", views.UserDetailView.as_view()),
    path("users/<int:user_id>/reviews/", views.UserReviewListView.as_view()),
    path("users/me/", views.ProfileView.as_view()),
    path("users/me/reviews/", views.UserReviewListView.as_view()),
]
