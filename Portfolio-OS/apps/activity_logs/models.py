from django.db import models
from django.conf import settings

class ActivityLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='activity_logs')
    action_type = models.CharField(max_length=50, help_text="e.g. LOGIN, FILE_CREATE, TERMINAL_EXEC")
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action_type} - {self.user.username if self.user else 'Anonymous'}"
