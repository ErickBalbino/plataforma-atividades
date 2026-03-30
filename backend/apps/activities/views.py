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
            qs = Activity.objects.all()
        elif user.role == 'TEACHER':
            qs = Activity.objects.filter(teacher=user)
        else:
            qs = Activity.objects.filter(classroom__memberships__student=user)
            
        if self.action == 'list':
            classroom_id = self.request.query_params.get('classroom')
            if classroom_id:
                qs = qs.filter(classroom_id=classroom_id)
                
            from django.db.models import Q
            search = self.request.query_params.get('search')
            if search:
                qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
            
        from django.db.models import Exists, OuterRef, Value, BooleanField


        from apps.submissions.models import Submission
        
        if user.role == 'STUDENT':
            student_submissions = Submission.objects.filter(
                activity=OuterRef('pk'),
                student=user
            )
            qs = qs.annotate(is_submitted=Exists(student_submissions))
        else:
            qs = qs.annotate(is_submitted=Value(False, output_field=BooleanField()))
            
        return qs

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
        from apps.classes.models import ClassRoomMembership
        from apps.submissions.models import Submission
        from django.db.models import OuterRef, Subquery, Value, IntegerField, Q
        
        submission_subquery = Submission.objects.filter(
            activity=activity,
            student=OuterRef('student')
        ).values('id')[:1]

        memberships = ClassRoomMembership.objects.filter(
            classroom=activity.classroom
        ).select_related('student').annotate(
            submission_id=Subquery(submission_subquery)
        )
        
        search = request.query_params.get('search')
        if search:
            memberships = memberships.filter(
                Q(student__name__icontains=search) | Q(student__email__icontains=search)
            )
            
        memberships = memberships.order_by('student__name', 'student__username')

        
        page = self.paginate_queryset(memberships)
        if page is not None:
            data = self._serialize_activity_members(page, activity)
            return self.get_paginated_response(data)

        data = self._serialize_activity_members(memberships, activity)
        return Response(data)


    def _serialize_activity_members(self, memberships, activity):
        from apps.submissions.models import Submission
        from apps.submissions.serializers import SubmissionReadSerializer
        from apps.accounts.serializers import UserSerializer
        
        results = []
        for member in memberships:
            submission = None
            if member.submission_id:
                try:
                    submission_obj = Submission.objects.get(id=member.submission_id)
                    submission = SubmissionReadSerializer(submission_obj).data
                except Submission.DoesNotExist:
                    pass
            
            results.append({
                "student": UserSerializer(member.student).data,
                "submission": submission,
                "joined_at": member.joined_at
            })
        return results

