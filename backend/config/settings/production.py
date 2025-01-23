from config.env import env

from .base import *

SECRET_KEY = env("SECRET_KEY", default=False)

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])
