from .models import Note, NoteFolder

def create_note_folder(name: str, owner) -> NoteFolder:
    return NoteFolder.objects.create(name=name, owner=owner)

def create_note(title: str, owner, content: str = "", folder: NoteFolder = None, is_pinned: bool = False, tags: str = "") -> Note:
    return Note.objects.create(
        title=title,
        owner=owner,
        content=content,
        folder=folder,
        is_pinned=is_pinned,
        tags=tags
    )

def update_note(note: Note, **kwargs) -> Note:
    for key, value in kwargs.items():
        setattr(note, key, value)
    note.save()
    return note

def toggle_pin(note: Note) -> Note:
    note.is_pinned = not note.is_pinned
    note.save()
    return note

def delete_note(note: Note):
    note.delete()
