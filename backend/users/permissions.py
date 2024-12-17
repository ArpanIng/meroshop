from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import UserRole


class IsAdmin(BasePermission):
    """
    Allows access only to users with the ADMIN role.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.ADMINISTRATOR
        )


class IsAdminOrReadOnly(BasePermission):
    """
    The request is authenticated as a ADMIN user, or is a read-only request.
    """

    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS
            or request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.ADMINISTRATOR
        )
