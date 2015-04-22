from django.db import models
from django.contrib.auth import authenticate
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone

# Create your models here.

class SCUserManager(BaseUserManager):
    def create_user(self, email, password, confirm_password, first_name, last_name):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
        )
        
        if password == confirm_password:
            user.set_password(password)

        user.save(using=self._db)

        user = authenticate(username=email, password=password)
        return user

    def create_superuser(self, email, password, first_name, last_name):
        user = self.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        user.is_staff = True;
        user.is_superuser = True;
        user.save(using=self._db)
        return user

class SCUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), max_length=255, unique=True)
    first_name = models.CharField(_('first name'), max_length=30)
    last_name = models.CharField(_('last name'), max_length=30)
    is_staff = models.BooleanField(_('staff status'), default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))
    is_active = models.BooleanField(_('active'), default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.'))
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = SCUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name
        
    def __unicode__(self):
        return self.email

