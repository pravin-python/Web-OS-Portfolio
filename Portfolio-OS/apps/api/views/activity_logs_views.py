from rest_framework import viewsets, permissions
from apps.activity_logs.models import ActivityLog
from ..serializers.activity_logs_serializers import ActivityLogSerializer

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ActivityLog.objects.filter(user=self.request.user)
