from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import IsTeacher, IsStudent
from .models import Activity
from .serializers import ActivityReadSerializer, ActivityCreateSerializer
from .permissions import IsActivityTeacher, IsActivityClassroom

class ActivityViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Activity.objects.none()
        
        if user.is_staff or user.is_superuser:
            return Activity.objects.all()
            
        if user.role == 'TEACHER':
            return Activity.objects.filter(teacher=user)
        return Activity.objects.filter(classroom__memberships__student=user)

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return ActivityCreateSerializer
        return ActivityReadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsTeacher()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsTeacher(), IsActivityTeacher()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(detail=True, methods=['get'], url_path='respostas', permission_classes=[IsTeacher, IsActivityTeacher])
    def get_submissions(self, request, pk=None):
        activity = self.get_object()
        from apps.submissions.models import Submission
        from apps.submissions.serializers import SubmissionReadSerializer
        
        submissions = Submission.objects.filter(activity=activity)
        serializer = SubmissionReadSerializer(submissions, many=True)
        return Response(serializer.data)
