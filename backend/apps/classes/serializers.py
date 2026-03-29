from rest_framework import serializers
from .models import ClassRoom

class ClassRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ('id', 'name', 'code', 'created_at')
        read_only_fields = ('id', 'code', 'created_at')

class ClassRoomJoinSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)

    def validate_code(self, value):
        try:
            classroom = ClassRoom.objects.get(code=value)
        except ClassRoom.DoesNotExist:
            raise serializers.ValidationError("Código de sala de aula inválido.")
            
        user = self.context['request'].user
        if classroom.memberships.filter(student=user).exists():
            raise serializers.ValidationError("Você já está participando desta sala de aula.")
            
        self.context['classroom'] = classroom
        return value

    def save(self):
        from .models import ClassRoomMembership
        user = self.context['request'].user
        classroom = self.context['classroom']
        membership = ClassRoomMembership.objects.create(
            classroom=classroom,
            student=user
        )
        return membership
