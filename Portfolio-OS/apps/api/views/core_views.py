from rest_framework import viewsets, permissions
from rest_framework.response import Response
from apps.core.models import SystemSetting, Wallpaper
from ..serializers.core_serializers import SystemSettingSerializer, WallpaperSerializer

class SystemSettingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        setting = self.queryset.first()
        serializer = self.get_serializer(setting)
        return Response({"success": True, "data": serializer.data, "message": "Settings fetched."})

class WallpaperViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Wallpaper.objects.all()
    serializer_class = WallpaperSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data, "message": "Wallpapers fetched"})
