from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from products.models import Product

STANDARD_DELIVERY_CHARGE = Decimal("10.00")


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart",
    )
    products = models.ManyToManyField(Product, through="CartItem")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} by {self.user}"

    def original_price(self):
        """
        Returns the total original price of all items in the cart without discount applied.
        """
        items = self.items.all()
        return sum([item.product.price * item.quantity for item in items])

    def discounted_price(self):
        """Returns the total discounted price of all items in the cart."""
        items = self.items.all()
        return sum([item.product.discounted_price * item.quantity for item in items])

    def discount_percentage(self):
        """Returns the total discount percentage of the cart."""
        original_price = self.original_price()
        discounted_price = self.discounted_price()
        if original_price > 0:
            return round((discounted_price / original_price) * 100, 2)
        return Decimal("0.00")

    def delivery_charge(self):
        return STANDARD_DELIVERY_CHARGE

    def subtotal(self):
        """
        Returns the subtotal price of the cart.
        """
        items = self.items.all()
        return sum([item.product.selling_price * item.quantity for item in items])

    def total(self):
        """
        Returns the total price of the cart, including delivery charges.
        """
        return self.subtotal() + self.delivery_charge()


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(1000)]
    )
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_added"]

    def __str__(self):
        return f"Cart {self.cart.id}: {self.product.name} x {self.quantity}"

    def clean(self):
        if self.quantity > self.product.stock:
            raise ValidationError({"quantity": "Quantity exceeds available stock."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def get_total(self):
        """
        Returns the total price of the item based on the product's selling price.
        """
        return self.product.selling_price * self.quantity
