from .models import Conversation, Message

def get_user_conversations(user):
    return Conversation.objects.filter(participants=user).prefetch_related('participants')

def get_conversation_messages(conversation):
    return Message.objects.filter(conversation=conversation)

def get_unread_messages_count(user):
    return Message.objects.filter(
        conversation__participants=user,
        is_read=False
    ).exclude(sender=user).count()
