from .models import CommandHistory
from apps.filesystem.selectors import list_directory
from apps.filesystem.models import FileNode
from django.utils import timezone

class CommandDispatcher:
    def __init__(self, user, current_path="/home"):
        self.user = user
        self.current_path = current_path
    
    def execute(self, command_str):
        parts = command_str.strip().split()
        if not parts:
            return ""

        cmd = parts[0].lower()
        args = parts[1:]
        
        output = ""
        status = "SUCCESS"

        try:
            if cmd == "help":
                output = self.cmd_help()
            elif cmd == "whoami":
                output = self.user.username
            elif cmd == "pwd":
                output = self.current_path
            elif cmd == "ls":
                output = self.cmd_ls(args)
            elif cmd == "cd":
                output = "Directory changed." # Virtual update handled via API generally
            elif cmd == "cat":
                output = self.cmd_cat(args)
            elif cmd == "open":
                output = f"Opening {args[0]}..." if args else "Usage: open <filename>"
            elif cmd == "clear":
                output = "" # UI-handled
            elif cmd == "about":
                output = "Web-OS Portfolio Simulator v1.0.0"
            elif cmd == "projects":
                output = "1. E-Commerce Platform\n2. AI Assistant\n3. Web-OS Portfolio"
            elif cmd == "skills":
                output = "Python, Django, React, TypeScript, Docker, AWS"
            elif cmd == "contact":
                output = "Email: admin@webos.com\nGitHub: github.com/admin"
            elif cmd == "run":
                output = self.cmd_run(args)
            else:
                output = f"Command not found: {cmd}"
                status = "ERROR"
        except Exception as e:
            output = f"Error: {str(e)}"
            status = "ERROR"

        # Log history
        CommandHistory.objects.create(
            user=self.user,
            command=command_str,
            output=output,
            status=status
        )

        return output

    def cmd_help(self):
        return "Available commands: help, whoami, pwd, ls, cd, cat, open, clear, about, projects, skills, contact, run"
        
    def cmd_ls(self, args):
        nodes = list_directory(owner=self.user)
        return "\n".join([n.name for n in nodes])
        
    def cmd_cat(self, args):
        if not args:
            return "Usage: cat <filename>"
        nodes = FileNode.objects.filter(owner=self.user, name=args[0], type='FILE')
        if nodes.exists():
            return nodes.first().content or ""
        return f"cat: {args[0]}: No such file"

    def cmd_run(self, args):
        if not args:
            return "Usage: run <app_name>"
        app_name = args[0].lower()
        if app_name == "snake":
            return "Launching Snake game..."
        elif app_name == "tictactoe":
            return "Launching TicTacToe..."
        return f"Unknown application: {app_name}"
