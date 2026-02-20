from rest_framework import viewsets, permissions
from apps.apps_registry.models import OSApp
from ..serializers.apps_registry_serializers import OSAppSerializer

class OSAppViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OSApp.objects.filter(is_enabled=True)
    serializer_class = OSAppSerializer
    permission_classes = [permissions.AllowAny]
