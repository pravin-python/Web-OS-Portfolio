from rest_framework import serializers
from apps.apps_registry.models import OSApp

class OSAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = OSApp
        fields = '__all__'
