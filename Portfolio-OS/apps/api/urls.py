from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views.user_views import UserViewSet
from .views.core_views import SystemSettingViewSet, WallpaperViewSet
from .views.filesystem_views import FileNodeViewSet
from .views.terminal_views import TerminalViewSet
from .views.notes_views import NoteViewSet, NoteFolderViewSet
from .views.messaging_views import ConversationViewSet, MessageViewSet
from .views.apps_registry_views import OSAppViewSet
from .views.activity_logs_views import ActivityLogViewSet

app_name = 'api'

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'system-settings', SystemSettingViewSet, basename='system-settings')
router.register(r'wallpapers', WallpaperViewSet, basename='wallpapers')
router.register(r'filesystem', FileNodeViewSet, basename='filesystem')
router.register(r'terminal', TerminalViewSet, basename='terminal')
router.register(r'notes-folders', NoteFolderViewSet, basename='notes-folders')
router.register(r'notes', NoteViewSet, basename='notes')
router.register(r'conversations', ConversationViewSet, basename='conversations')
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'apps-registry', OSAppViewSet, basename='apps-registry')
router.register(r'activity-logs', ActivityLogViewSet, basename='activity-logs')

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
