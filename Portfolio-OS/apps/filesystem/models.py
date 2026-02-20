from django.db import models
from django.conf import settings
import uuid

class FileNode(models.Model):
    TYPE_CHOICES = (
        ('FILE', 'File'),
        ('FOLDER', 'Folder'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files')
    content = models.TextField(blank=True, null=True) # Text or JSON content
    size = models.PositiveIntegerField(default=0)
    is_hidden = models.BooleanField(default=False)
    is_system = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('parent', 'name', 'owner')
        ordering = ['-type', 'name'] # Folders first, then alphabetically

    def __str__(self):
        return f"{self.name} ({self.type})"
