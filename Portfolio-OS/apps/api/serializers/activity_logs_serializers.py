from rest_framework import serializers
from apps.activity_logs.models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'
