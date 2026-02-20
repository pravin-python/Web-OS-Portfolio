from .models import User, Role

def get_user_by_username(username: str) -> User:
    return User.objects.filter(username=username).first()

def get_user_roles(user: User):
    return user.user_roles.select_related('role').all()
