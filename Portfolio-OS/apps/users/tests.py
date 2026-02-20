from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.models import Role, UserRole
from apps.users.services import create_user, assign_role_to_user

User = get_user_model()

class UserModelTests(TestCase):
    def test_create_user(self):
        user = create_user('testuser', 'test@webos.com', 'testpass123')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@webos.com')
        self.assertTrue(user.check_password('testpass123'))
        
    def test_assign_role(self):
        user = create_user('testadmin', 'admin@webos.com', 'testpass123')
        user_role = assign_role_to_user(user, 'admin')
        self.assertEqual(user_role.role.name, 'admin')
        self.assertEqual(user_role.user, user)
        self.assertEqual(UserRole.objects.count(), 1)
