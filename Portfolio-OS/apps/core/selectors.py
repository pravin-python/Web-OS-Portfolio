from .models import SystemSetting, Wallpaper

def get_system_setting():
    return SystemSetting.objects.first()

def get_wallpapers():
    return Wallpaper.objects.all()

def get_default_wallpaper():
    return Wallpaper.objects.filter(is_default=True).first()
