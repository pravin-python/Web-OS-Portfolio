from django.db import models

class SystemSetting(models.Model):
    site_name = models.CharField(max_length=100, default='Web-OS')
    os_version = models.CharField(max_length=20, default='1.0.0')
    maintenance_mode = models.BooleanField(default=False)
    allow_registration = models.BooleanField(default=True)
    terminal_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.site_name

class Wallpaper(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='wallpapers/')
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name
