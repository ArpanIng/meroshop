from decimal import Decimal

from django.test import TestCase

from users.models import CustomUser
from vendors.models import Vendor

from .models import Category, Product


class ProductTestCase(TestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            email="user1@example.com",
            username="user1",
            first_name="user1",
            last_name="doe",
        )
        self.cat1 = Category.objects.create(name="cat1", slug="cat1")
        self.ven1 = Vendor.objects.create(
            name="ven1",
            user=self.user1,
            description="lorem",
            email="ven1@example.com",
            address="lorem",
            phone_number="0000000000",
        )
        self.product1 = Product.objects.create(
            name="product1",
            slug="product1",
            description="lorem",
            price=Decimal("20.0"),
            discount_price=Decimal("10.0"),
            stock=2,
            category=self.cat1,
            vendor=self.ven1,
        )
        self.product2 = Product.objects.create(
            name="product2",
            slug="product2",
            description="lorem",
            price=Decimal("20.0"),
            stock=0,
            category=self.cat1,
            vendor=self.ven1,
        )

    def test_in_stock(self):
        self.assertTrue(self.product1.stock)
        self.assertFalse(self.product2.stock)

    def test_has_discount(self):
        self.assertTrue(self.product1.has_discount)
        self.assertIsNone(self.product2.discount_price)
        self.assertFalse(self.product2.has_discount)

    def test_selling_price(self):
        # with discount
        self.assertEqual(self.product1.selling_price, Decimal("10.0"))
        # without discount
        self.assertEqual(self.product2.selling_price, Decimal("20.0"))
