from rest_framework import viewsets, permissions
from apps.notes.models import Note, NoteFolder
from ..serializers.notes_serializers import NoteSerializer, NoteFolderSerializer
from apps.notes.selectors import get_user_notes

class NoteFolderViewSet(viewsets.ModelViewSet):
    serializer_class = NoteFolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NoteFolder.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        folder_id = self.request.query_params.get('folder_id')
        search_query = self.request.query_params.get('search')
        return get_user_notes(self.request.user, folder_id, search_query)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
