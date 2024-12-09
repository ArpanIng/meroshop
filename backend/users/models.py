from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserRole(models.TextChoices):
    CUSTOMER = "CUS", "Customer"
    VENDOR = "VEN", "Vendor"
    ADMINISTRATOR = "ADMIN", "Administrator"


class CustomUserManager(BaseUserManager):
    def create_user(
        self,
        email,
        username,
        first_name,
        last_name,
        password=None,
        **extra_fields,
    ):
        """
        Creates and saves a User with the given email, username, first_name, last_name and password.
        """

        if not email:
            raise ValueError("Users must have an email address.")

        extra_fields.setdefault("role", UserRole.CUSTOMER)

        user = self.model(
            email=self.normalize_email(email=email),
            username=username,
            first_name=first_name,
            last_name=last_name,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        email,
        username,
        first_name,
        last_name,
        password=None,
        **extra_fields,
    ):
        """
        Creates and saves a superuser with the given email, username, first_name, last_name and password.
        """

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", UserRole.ADMINISTRATOR)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        user = self.create_user(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            **extra_fields,
        )
        user.save(using=self._db)
        return user


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=5, choices=UserRole.choices, default=UserRole.CUSTOMER
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    objects = CustomUserManager()

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    city = models.CharField(max_length=100, blank=True, default="")
    state = models.CharField(max_length=100, blank=True, default="")
    address = models.CharField(max_length=100, blank=True, default="")
    phone_number = models.CharField(max_length=15, blank=True, default="")
    profile_picture = models.ImageField(
        upload_to="profiles/", default="default_user.jpg", blank=True, null=True
    )

    def __str__(self):
        return f"{self.user.email}'s profile"
