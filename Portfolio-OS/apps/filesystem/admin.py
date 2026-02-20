from django.contrib import admin
from .models import FileNode

@admin.register(FileNode)
class FileNodeAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'owner', 'parent', 'is_system', 'is_hidden')
    list_filter = ('type', 'is_system', 'is_hidden')
    search_fields = ('name', 'owner__username')
