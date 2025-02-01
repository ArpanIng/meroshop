from django.urls import path

from . import views

urlpatterns = [
    path("vendors/", views.VendorListView.as_view()),
    path("vendors/status-choices/", views.VendorStatusChoicesView.as_view()),
    path("vendors/<int:pk>/", views.VendorDetailView.as_view()),
    path("vendors/products/", views.VendorProductListView.as_view()),
]
