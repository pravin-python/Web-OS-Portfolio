from .models import LoginAttempt
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model

User = get_user_model()

def record_login_attempt(ip_address: str, success: bool, user=None) -> LoginAttempt:
    attempt = LoginAttempt.objects.create(
        ip_address=ip_address,
        success=success,
        user=user
    )
    
    if user and not success:
        _check_and_lock_user(user)

    return attempt

def _check_and_lock_user(user):
    time_threshold = timezone.now() - timedelta(minutes=15)
    recent_attempts = LoginAttempt.objects.filter(
        user=user, 
        attempted_at__gte=time_threshold
    ).order_by('-attempted_at')[:5]

    if len(recent_attempts) == 5 and all(not attempt.success for attempt in recent_attempts):
        user.is_active = False
        user.save()
