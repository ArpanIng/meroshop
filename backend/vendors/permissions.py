from rest_framework.permissions import SAFE_METHODS, BasePermission

from users.models import UserRole


class IsVendor(BasePermission):
    """
    Allows access only to users with the VENDOR role.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.is_vendor
        )


class IsVendorOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow vendor owner of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in SAFE_METHODS:
            return True

        # write permissions are only allowed to the user of the vendor.
        return obj.user == request.user
