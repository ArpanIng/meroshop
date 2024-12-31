from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from debug_toolbar.toolbar import debug_toolbar_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("products.urls")),
    path("api/", include("users.urls")),
    path("api/", include("vendors.urls")),
    path("api/carts/", include("carts.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += debug_toolbar_urls()
