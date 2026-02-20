from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.filesystem.services import init_user_filesystem

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialize the root filesystem for all users who do not have one'

    def handle(self, *args, **options):
        users = User.objects.all()
        for user in users:
            if not user.files.filter(name='home').exists():
                init_user_filesystem(user)
                self.stdout.write(self.style.SUCCESS(f'Initialized FS for {user.username}'))
        
        self.stdout.write(self.style.SUCCESS('Filesystem initialization check complete.'))
