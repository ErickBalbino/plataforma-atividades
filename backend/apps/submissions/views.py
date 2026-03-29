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
from .permissions import IsSubmissionStudent, IsSubmissionActivityTeacher, IsSubmissionOwnerOrTeacher

class SubmissionViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Submission.objects.none()

        if user.is_staff or user.is_superuser:
            qs = Submission.objects.all()
        elif user.role == 'TEACHER':
            qs = Submission.objects.filter(activity__teacher=user)
        else:
            qs = Submission.objects.filter(student=user)
            
        activity_id = self.request.query_params.get('activity')
        if activity_id:
            qs = qs.filter(activity_id=activity_id)
            
        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SubmissionCreateSerializer
        if self.request.method in ['PUT', 'PATCH']:
            if hasattr(self.request, 'user') and self.request.user.is_authenticated:
                if getattr(self.request.user, 'role', None) == 'TEACHER':
                    return SubmissionGradeSerializer
            return SubmissionUpdateSerializer
        return SubmissionReadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsStudent()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSubmissionOwnerOrTeacher()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)