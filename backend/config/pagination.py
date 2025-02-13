from rest_framework import pagination


class CustomLimitOffsetPagination(pagination.LimitOffsetPagination):
    default_limit = 8

    def get_limit(self, request):
        if request.user.is_superuser and request.user.is_staff:
            self.max_limit = 100  # maximum allowable limit
        else:
            self.max_limit = 10
        return super().get_limit(request)
