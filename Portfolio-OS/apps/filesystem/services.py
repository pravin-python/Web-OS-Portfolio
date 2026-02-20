from .models import FileNode
from django.contrib.auth import get_user_model

def create_folder(name: str, owner, parent: FileNode = None, is_system: bool = False, is_hidden: bool = False) -> FileNode:
    return FileNode.objects.create(
        name=name,
        type='FOLDER',
        owner=owner,
        parent=parent,
        is_system=is_system,
        is_hidden=is_hidden
    )

def create_file(name: str, owner, content: str = "", parent: FileNode = None, is_system: bool = False, is_hidden: bool = False) -> FileNode:
    return FileNode.objects.create(
        name=name,
        type='FILE',
        owner=owner,
        content=content,
        size=len(content),
        parent=parent,
        is_system=is_system,
        is_hidden=is_hidden
    )

def rename_node(node: FileNode, new_name: str) -> FileNode:
    node.name = new_name
    node.save()
    return node

def move_node(node: FileNode, new_parent: FileNode) -> FileNode:
    node.parent = new_parent
    node.save()
    return node

def delete_node(node: FileNode):
    node.delete()

def init_user_filesystem(user):
    home = create_folder(name="home", owner=user, is_system=True)
    user_home = create_folder(name=user.username, owner=user, parent=home, is_system=True)
    create_folder(name="documents", owner=user, parent=user_home, is_system=True)
    create_folder(name="projects", owner=user, parent=user_home, is_system=True)
    create_folder(name="games", owner=user, parent=user_home, is_system=True)
