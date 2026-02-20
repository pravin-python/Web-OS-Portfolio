import pytest
from apps.terminal.services import CommandDispatcher
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def test_user(db):
    return User.objects.create_user(username="testuser", password="password")

@pytest.mark.django_db
def test_help_command(test_user):
    dispatcher = CommandDispatcher(user=test_user, current_path="/")
    output, new_path = dispatcher.execute("help")
    
    assert "Available commands:" in output
    assert "help" in output

@pytest.mark.django_db
def test_whoami_command(test_user):
    dispatcher = CommandDispatcher(user=test_user, current_path="/")
    output, new_path = dispatcher.execute("whoami")
    
    assert output == "testuser"

@pytest.mark.django_db
def test_unknown_command(test_user):
    dispatcher = CommandDispatcher(user=test_user, current_path="/")
    output, new_path = dispatcher.execute("notarealcommand")
    
    assert "Command not found" in output
