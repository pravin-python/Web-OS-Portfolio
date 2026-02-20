from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.terminal.models import CommandHistory
from ..serializers.terminal_serializers import CommandHistorySerializer
from apps.terminal.services import CommandDispatcher

class TerminalViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['POST'])
    def execute(self, request):
        command = request.data.get('command')
        current_path = request.data.get('current_path', '/home')
        if not command:
            return Response({"success": False, "message": "Command is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        dispatcher = CommandDispatcher(user=request.user, current_path=current_path)
        output = dispatcher.execute(command)
        
        return Response({
            "success": True,
            "data": {"output": output},
            "message": "Command executed."
        })
        
    @action(detail=False, methods=['GET'])
    def history(self, request):
        history = CommandHistory.objects.filter(user=request.user)[:50]
        serializer = CommandHistorySerializer(history, many=True)
        return Response({"success": True, "data": serializer.data, "message": "History fetched."})
