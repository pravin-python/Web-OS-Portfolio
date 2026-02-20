from .models import ActivityLog

def log_activity(action_type: str, description: str, user=None, ip_address=None) -> ActivityLog:
    return ActivityLog.objects.create(
        user=user,
        action_type=action_type,
        description=description,
        ip_address=ip_address
    )
