from .models import OSApp

def toggle_app_status(app: OSApp, is_enabled: bool) -> OSApp:
    app.is_enabled = is_enabled
    app.save()
    return app
