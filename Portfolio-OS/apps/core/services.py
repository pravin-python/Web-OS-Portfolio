from .models import SystemSetting

def get_or_create_system_setting() -> SystemSetting:
    setting, _ = SystemSetting.objects.get_or_create(id=1)
    return setting

def update_system_setting(**kwargs) -> SystemSetting:
    setting = get_or_create_system_setting()
    for key, value in kwargs.items():
        setattr(setting, key, value)
    setting.save()
    return setting
