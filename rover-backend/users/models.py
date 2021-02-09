from django.db import models

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    name = models.CharField(max_length=30)
    phone = models.CharField(max_length=15)
    image = models.CharField(max_length=128)

    username = None
    date_joined = None
    last_login = None
    first_name = None
    last_name = None

    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
