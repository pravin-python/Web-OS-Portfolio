from rest_framework import serializers
from apps.core.models import SystemSetting, Wallpaper

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = '__all__'

class WallpaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallpaper
        fields = '__all__'
