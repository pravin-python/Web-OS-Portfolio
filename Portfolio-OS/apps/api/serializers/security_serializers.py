from rest_framework import serializers
from apps.security.models import LoginAttempt

class LoginAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginAttempt
        fields = '__all__'
