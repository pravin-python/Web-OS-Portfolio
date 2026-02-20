from django.contrib import admin
from .models import ActivityLog

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('action_type', 'user', 'ip_address', 'created_at')
    list_filter = ('action_type', 'created_at')
    search_fields = ('user__username', 'description', 'ip_address')
    readonly_fields = ('user', 'action_type', 'description', 'ip_address', 'created_at')

    def has_add_permission(self, request):
        return False
