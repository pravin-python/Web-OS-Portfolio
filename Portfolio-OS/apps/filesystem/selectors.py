from .models import FileNode

def get_node_by_id(node_id) -> FileNode:
    return FileNode.objects.filter(id=node_id).first()

def list_directory(parent_node: FileNode = None, owner=None):
    queryset = FileNode.objects.all()
    if owner:
        queryset = queryset.filter(owner=owner)
    if parent_node:
        queryset = queryset.filter(parent=parent_node)
    else:
        queryset = queryset.filter(parent__isnull=True)
    return queryset
