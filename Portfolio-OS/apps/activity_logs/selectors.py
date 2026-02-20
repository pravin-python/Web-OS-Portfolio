from .models import ActivityLog

def get_user_activity(user):
    return ActivityLog.objects.filter(user=user)

def get_recent_activities(limit=50):
    return ActivityLog.objects.all()[:limit]
