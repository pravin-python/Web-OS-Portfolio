from rest_framework import serializers
from apps.notes.models import Note, NoteFolder

class NoteFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteFolder
        fields = '__all__'

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
