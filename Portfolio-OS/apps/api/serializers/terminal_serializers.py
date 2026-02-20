from rest_framework import serializers
from apps.terminal.models import CommandHistory

class CommandHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandHistory
        fields = '__all__'
