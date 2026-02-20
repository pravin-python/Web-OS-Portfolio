from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.filesystem.models import FileNode
from ..serializers.filesystem_serializers import FileNodeSerializer
from apps.filesystem.services import create_folder, create_file, rename_node, move_node, delete_node
from apps.filesystem.selectors import list_directory

class FileNodeViewSet(viewsets.ModelViewSet):
    serializer_class = FileNodeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FileNode.objects.filter(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        parent_id = request.query_params.get('parent_id')
        parent = None
        if parent_id:
            parent = FileNode.objects.filter(id=parent_id, owner=request.user).first()
            if not parent:
                return Response({"success": False, "message": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)
        
        nodes = list_directory(parent_node=parent, owner=request.user)
        serializer = self.get_serializer(nodes, many=True)
        return Response({"success": True, "data": serializer.data, "message": "Directory listed."})

    @action(detail=False, methods=['POST'])
    def create_entity(self, request):
        name = request.data.get('name')
        item_type = request.data.get('type')
        parent_id = request.data.get('parent_id')
        content = request.data.get('content', '')
        
        if not name or not item_type:
            return Response({"success": False, "message": "Name and type required"}, status=status.HTTP_400_BAD_REQUEST)
            
        parent = None
        if parent_id:
            parent = FileNode.objects.filter(id=parent_id, owner=request.user).first()
            
        if item_type == 'FOLDER':
            node = create_folder(name=name, owner=request.user, parent=parent)
        else:
            node = create_file(name=name, owner=request.user, content=content, parent=parent)
            
        return Response({"success": True, "data": FileNodeSerializer(node).data, "message": f"{item_type} created."})
