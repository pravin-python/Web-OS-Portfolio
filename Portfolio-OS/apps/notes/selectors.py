from .models import Note, NoteFolder

def get_user_notes(user, folder_id=None, search_query=None):
    queryset = Note.objects.filter(owner=user)
    if folder_id:
        queryset = queryset.filter(folder_id=folder_id)
    if search_query:
        queryset = queryset.filter(title__icontains=search_query) | queryset.filter(content__icontains=search_query) | queryset.filter(tags__icontains=search_query)
        queryset = queryset.distinct()
    return queryset

def get_user_folders(user):
    return NoteFolder.objects.filter(owner=user)

def get_note_by_id(note_id) -> Note:
    return Note.objects.filter(id=note_id).first()
