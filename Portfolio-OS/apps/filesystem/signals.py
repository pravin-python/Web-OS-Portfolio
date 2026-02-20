from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .services import init_user_filesystem

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_filesystem(sender, instance, created, **kwargs):
    if created:
        init_user_filesystem(instance)
