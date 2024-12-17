from rest_framework.permissions import SAFE_METHODS, BasePermission

from users.models import UserRole


class IsVendor(BasePermission):
    """
    Allows access only to users with the VENDOR role.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.VENDOR
        )


class IsVendorOrReadOnly(BasePermission):
    """
    The request is authenticated as a VENDOR user, or is a read-only request.
    """

    def has_permission(self, request, view):
        return bool(
            request.user in SAFE_METHODS
            or request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.VENDOR
        )
