from rest_framework import serializers
from .models import Activity
from apps.classes.serializers import ClassRoomSerializer
from apps.accounts.serializers import UserSerializer

class ActivityReadSerializer(serializers.ModelSerializer):
    classroom = ClassRoomSerializer(read_only=True)
    teacher = UserSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = ('id', 'title', 'description', 'classroom', 'teacher', 'due_date', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class ActivityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'title', 'description', 'classroom', 'due_date')
        
    def validate_due_date(self, value):
        from django.utils import timezone
        if value < timezone.now():
            raise serializers.ValidationError('A data de entrega não pode ser no passado.')
        return value

    def to_representation(self, instance):
        return ActivityReadSerializer(instance, context=self.context).data
