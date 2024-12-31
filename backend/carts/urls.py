from django.urls import path

from . import views

urlpatterns = [
    path("", views.CartListView.as_view()),
    path("<int:pk>/", views.CartDetailView.as_view()),
    path("user/", views.UserCartView.as_view()),
    path("add/", views.AddToCartView.as_view()),
    path("remove/<int:pk>/", views.RemoveFromCartView.as_view()),
    path("increment/<int:pk>/", views.IncrementCartItemQuantityView.as_view()),
    path("decrement/<int:pk>/", views.DecrementCartItemQuantityView.as_view()),
]
