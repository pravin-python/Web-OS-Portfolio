from django.db import models
from django.conf import settings

class LoginAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='login_attempts', null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    success = models.BooleanField()
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-attempted_at']

    def __str__(self):
        return f"Attempt from {self.ip_address} - {'Success' if self.success else 'Failed'}"
