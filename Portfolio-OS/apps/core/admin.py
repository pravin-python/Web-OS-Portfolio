from django.contrib import admin
from .models import SystemSetting, Wallpaper

@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'os_version', 'maintenance_mode', 'allow_registration', 'terminal_enabled')

@admin.register(Wallpaper)
class WallpaperAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_default')
