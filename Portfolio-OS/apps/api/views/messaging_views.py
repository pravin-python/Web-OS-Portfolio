from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.messaging.models import Conversation, Message
from ..serializers.messaging_serializers import ConversationSerializer, MessageSerializer
from apps.messaging.services import send_message, mark_as_read
from django.contrib.auth import get_user_model

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)
        
    @action(detail=True, methods=['GET'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response({"success": True, "data": serializer.data, "message": "Messages fetched"})

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(conversation__participants=self.request.user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
