from django.contrib import admin
from .models import Note, NoteFolder

@admin.register(NoteFolder)
class NoteFolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at')
    search_fields = ('name', 'owner__username')

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'folder', 'is_pinned', 'updated_at')
    list_filter = ('is_pinned', 'folder')
    search_fields = ('title', 'owner__username', 'tags')
