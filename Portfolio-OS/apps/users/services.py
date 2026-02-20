from .models import User, Role, UserRole

def create_user(username: str, email: str, password: str = None) -> User:
    user = User.objects.create_user(username=username, email=email, password=password)
    return user

def assign_role_to_user(user: User, role_name: str) -> UserRole:
    role, _ = Role.objects.get_or_create(name=role_name)
    user_role, _ = UserRole.objects.get_or_create(user=user, role=role)
    return user_role
