from .models import OSApp

def get_installed_apps(only_enabled=True):
    queryset = OSApp.objects.all()
    if only_enabled:
        queryset = queryset.filter(is_enabled=True)
    return queryset
