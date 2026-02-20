from django.db import models

class OSApp(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.ImageField(upload_to='app_icons/', blank=True, null=True)
    route = models.CharField(max_length=255, help_text="Frontend route or component name")
    is_system = models.BooleanField(default=False)
    is_enabled = models.BooleanField(default=True)
    launch_command = models.CharField(max_length=100, blank=True, help_text="Terminal command to launch")

    def __str__(self):
        return self.name
