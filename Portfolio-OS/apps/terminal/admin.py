from django.contrib import admin
from .models import CommandHistory

@admin.register(CommandHistory)
class CommandHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'command', 'status', 'executed_at')
    list_filter = ('status', 'executed_at')
    search_fields = ('user__username', 'command')
