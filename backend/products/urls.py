from django.urls import path

from . import views

urlpatterns = [
    path("categories/", views.CategoryListView.as_view()),
    path("categories/<slug:category_slug>/", views.CategoryDetailView.as_view()),
    path("products/", views.ProductListView.as_view()),
    path("products/status-choices/", views.ProductStatusChoicesView.as_view()),
    path("products/<slug:product_slug>/", views.ProductDetailView.as_view()),
    path(
        "products/<slug:product_slug>/reviews/",
        views.ProductReviewListView.as_view(),
    ),
    path("reviews/", views.ReviewListView.as_view()),
    path("reviews/<int:review_id>/", views.ReviewDetailView.as_view()),
]
