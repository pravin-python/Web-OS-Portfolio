from django.db import models
from django.conf import settings
import uuid

class NoteFolder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='note_folders')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('name', 'owner')

    def __str__(self):
        return f"{self.name} ({self.owner.username})"

class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    folder = models.ForeignKey(NoteFolder, on_delete=models.SET_NULL, null=True, blank=True, related_name='notes')
    is_pinned = models.BooleanField(default=False)
    tags = models.CharField(max_length=255, blank=True, help_text="Comma separated tags")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-updated_at']

    def __str__(self):
        return self.title
