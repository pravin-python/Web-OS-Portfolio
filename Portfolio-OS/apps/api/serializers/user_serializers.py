from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.users.models import Role, UserRole

User = get_user_model()

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'description')

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar', 'is_active', 'is_staff', 'date_joined', 'roles')

    def get_roles(self, obj):
        user_roles = obj.user_roles.select_related('role')
        return [ur.role.name for ur in user_roles]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
