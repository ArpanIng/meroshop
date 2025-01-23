from .base import *

LOCAL_INSTALLED_APPS = [
    "debug_toolbar",
]

INSTALLED_APPS = INSTALLED_APPS + LOCAL_INSTALLED_APPS

LOCAL_MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

MIDDLEWARE = MIDDLEWARE + LOCAL_MIDDLEWARE

# Debug Toolbar configuration
INTERNAL_IPS = [
    "127.0.0.1",
]

# Django DebugToolbar to work in docker
DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": lambda request: DEBUG,
}
