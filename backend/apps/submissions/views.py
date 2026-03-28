from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import IsTeacher, IsStudent
from .models import Submission
from .serializers import (
    SubmissionReadSerializer, 
    SubmissionCreateSerializer, 
    SubmissionUpdateSerializer, 
    SubmissionGradeSerializer
)
from .permissions import IsSubmissionStudent, IsSubmissionActivityTeacher

class SubmissionViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Submission.objects.none()

        if user.is_staff or user.is_superuser:
            return Submission.objects.all()

        if user.role == 'TEACHER':
            return Submission.objects.filter(activity__teacher=user)
        return Submission.objects.filter(student=user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SubmissionCreateSerializer
        if self.request.method in ['PUT', 'PATCH']:
            if self.request.user.role == 'TEACHER':
                return SubmissionGradeSerializer
            return SubmissionUpdateSerializer
        return SubmissionReadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsStudent()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsStudent])
    def my_submissions(self, request):
        queryset = Submission.objects.filter(student=request.user)
        serializer = SubmissionReadSerializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        
        if user.role == 'STUDENT':
            if instance.student != user:
                return Response({'detail': 'Você não tem permissão para editar esta resposta.'}, status=status.HTTP_403_FORBIDDEN)
        elif user.role == 'TEACHER':
            if instance.activity.teacher != user:
                return Response({'detail': 'Você não tem permissão para corrigir esta resposta.'}, status=status.HTTP_403_FORBIDDEN)
        
        return super().update(request, *args, **kwargs)
