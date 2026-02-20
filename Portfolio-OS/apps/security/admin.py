from django.contrib import admin
from .models import LoginAttempt

@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'ip_address', 'success', 'attempted_at')
    list_filter = ('success', 'attempted_at')
    search_fields = ('user__username', 'ip_address')
    readonly_fields = ('user', 'ip_address', 'success', 'attempted_at')

    def has_add_permission(self, request):
        return False
