from rest_framework import serializers
from .models import Submission
from apps.activities.serializers import ActivityReadSerializer
from apps.accounts.serializers import UserSerializer
from django.utils import timezone

class SubmissionReadSerializer(serializers.ModelSerializer):
    activity = ActivityReadSerializer(read_only=True)
    student = UserSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = ('id', 'activity', 'student', 'content', 'grade', 'feedback', 'turned_in_at', 'updated_at')
        read_only_fields = ('id', 'turned_in_at', 'updated_at')

class SubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ('id', 'activity', 'content')

    def validate(self, data):
        activity = data.get('activity')
        user = self.context['request'].user

        if user.classroom != activity.classroom:
            raise serializers.ValidationError('Você não pertence à turma desta atividade.')

        if Submission.objects.filter(activity=activity, student=user).exists():
            raise serializers.ValidationError('Você já enviou uma resposta para esta atividade.')

        if activity.due_date < timezone.now():
            raise serializers.ValidationError('O prazo para entrega desta atividade já se encerrou.')

        return data

class SubmissionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ('id', 'content')

    def validate(self, data):
        instance = self.instance
        if instance.activity.due_date < timezone.now():
            raise serializers.ValidationError('Não é possível alterar a resposta após o prazo de entrega.')
        return data

class SubmissionGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ('id', 'grade', 'feedback')
        extra_kwargs = {
            'grade': {'required': True},
        }

    def validate_grade(self, value):
        if value < 0 or value > 10:
            raise serializers.ValidationError('A nota deve estar entre 0 e 10.')
        return value
