from .models import Conversation, Message

def get_or_create_conversation(user1, user2) -> Conversation:
    convs = Conversation.objects.filter(participants=user1).filter(participants=user2)
    if convs.exists():
        return convs.first()
        
    conversation = Conversation.objects.create()
    conversation.participants.add(user1, user2)
    return conversation

def send_message(sender, conversation: Conversation, content: str, attachment=None) -> Message:
    return Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content,
        attachment=attachment
    )

def mark_as_read(message: Message) -> Message:
    message.is_read = True
    message.save()
    return message
