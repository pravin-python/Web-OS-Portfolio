from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Role, PermissionGroup, UserRole

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(PermissionGroup)
class PermissionGroupAdmin(admin.ModelAdmin):
    list_display = ('code_name',)

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
