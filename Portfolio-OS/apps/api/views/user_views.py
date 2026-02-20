from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from ..serializers.user_serializers import UserSerializer, RegisterSerializer
from apps.users.services import create_user

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['register']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['GET'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response({"success": True, "data": serializer.data, "message": "User details fetched."})

    @action(detail=False, methods=['POST'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"success": True, "data": UserSerializer(user).data, "message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors, "message": "Validation failed."}, status=status.HTTP_400_BAD_REQUEST)
