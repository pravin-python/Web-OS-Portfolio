from django.contrib import admin
from .models import OSApp

@admin.register(OSApp)
class OSAppAdmin(admin.ModelAdmin):
    list_display = ('name', 'route', 'is_system', 'is_enabled', 'launch_command')
    list_filter = ('is_system', 'is_enabled')
    search_fields = ('name', 'route', 'launch_command')
