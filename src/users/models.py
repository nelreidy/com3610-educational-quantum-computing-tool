from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from .progress import Lesson, Section, LessonProgress, TestScore

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    # def __str__(self):
    #     return self.email
    
User = get_user_model()
class UserFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    uploaded_file = models.TextField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    last_modified = models.DateTimeField(auto_now=True)


