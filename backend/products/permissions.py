from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsProductVendorOwnerOrReadOnly(BasePermission):
    """Object-level permission to only allow product vendor owner of an object to edit it."""

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in SAFE_METHODS:
            return True

        # write permissions are only allowed to the vendor user of the product.
        return obj.vendor.user == request.user
