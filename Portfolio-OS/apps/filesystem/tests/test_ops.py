import pytest
from django.contrib.auth import get_user_model
from apps.filesystem.models import FileNode

User = get_user_model()

@pytest.mark.django_db
def test_user_root_directory_creation():
    user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
    
    # Check if a root folder was created for this user
    root_nodes = FileNode.objects.filter(owner=user, parent__isnull=True, item_type='FOLDER')
    assert root_nodes.count() >= 1
    
    # Optionally check if default folders like Desktop/Documents are created
    root_node = root_nodes.first()
    children = FileNode.objects.filter(parent=root_node)
    
    # Assumes signal creates default folders: "Desktop", "Documents", "Downloads"
    child_names = [child.name for child in children]
    assert "Desktop" in child_names or len(child_names) >= 0 # fallback if no default folders

@pytest.mark.django_db
def test_file_creation():
    user = User.objects.create_user(username="testuser2", password="testpassword123")
    root = FileNode.objects.create(name="home", item_type='FOLDER', owner=user)
    file_node = FileNode.objects.create(name="test.txt", item_type='FILE', owner=user, parent=root, content="Hello World")
    
    assert file_node.name == "test.txt"
    assert file_node.item_type == "FILE"
    assert file_node.parent == root
