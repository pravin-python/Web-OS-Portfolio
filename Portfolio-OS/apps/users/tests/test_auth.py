import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_user_creation():
    user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.check_password("testpassword123") is True
    assert user.is_active is True

@pytest.mark.django_db
def test_superuser_creation():
    admin = User.objects.create_superuser(username="admin", email="admin@example.com", password="adminpassword123")
    assert admin.username == "admin"
    assert admin.is_superuser is True
    assert admin.is_staff is True
