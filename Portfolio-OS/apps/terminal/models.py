from django.db import models
from django.conf import settings

class CommandHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='command_history')
    command = models.CharField(max_length=500)
    output = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='SUCCESS') # SUCCESS, ERROR
    executed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-executed_at']
        verbose_name_plural = "Command Histories"

    def __str__(self):
        return f"{self.user.username}: {self.command}"
