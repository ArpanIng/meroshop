from django.db import models
from django.db.models import Avg, Count, Q, Sum
from django.db.models.functions import Round


class ProductQuerySet(models.QuerySet):
    def active_products(self):
        return self.filter(status="ACTIVE")

    def discontinued_products(self):
        return self.filter(status="DISCONTINUED")

    def reviews_annotations(self, all_reviews: bool = False):
        """
        Annotates the product with reviews to get total reviews, average rating, and sum of ratings of a product.
        """

        # for admin users, include all product reviews
        # for other users, include only active product reviews
        review_filter = Q() if all_reviews else Q(reviews__is_active=True)

        return self.annotate(
            reviews_count=Count("reviews", filter=review_filter),
            avg_rating=Round(
                Avg("reviews__rating", filter=review_filter, default=0), 2
            ),
            sum_rating=Sum("reviews__rating", filter=review_filter, default=0),
        )


class ProductManager(models.Manager):
    def get_queryset(self):
        return ProductQuerySet(self.model, using=self._db)

    def active_products(self):
        return self.get_queryset().active_products()

    def discontinued_products(self):
        return self.get_queryset().discontinued_products()

    def reviews_annotations(self, all_reviews: bool = False):
        return self.get_queryset().reviews_annotations(all_reviews=all_reviews)
