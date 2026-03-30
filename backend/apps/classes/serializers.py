from rest_framework import serializers
from .models import ClassRoom, ClassRoomMembership
from apps.accounts.serializers import UserSerializer

class ClassRoomMembershipSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = ClassRoomMembership
        fields = ('id', 'student', 'joined_at')

class ClassRoomReadSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    students_count = serializers.SerializerMethodField()
    activities_count = serializers.SerializerMethodField()

    class Meta:
        model = ClassRoom
        fields = ('id', 'name', 'code', 'teacher', 'created_at', 'students_count', 'activities_count')

    def get_students_count(self, obj):
        return obj.memberships.count()
        
    def get_activities_count(self, obj):
        return obj.activities.count()

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
