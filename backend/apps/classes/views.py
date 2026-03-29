from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ClassRoom
from .serializers import ClassRoomSerializer, ClassRoomJoinSerializer, ClassRoomReadSerializer
from apps.accounts.permissions import IsTeacher, IsStudent
from .permissions import IsClassRoomTeacher

class ClassRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ClassRoomSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ClassRoomReadSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ClassRoom.objects.none()
            
        if user.role == 'TEACHER':
            return ClassRoom.objects.filter(teacher=user)
        return ClassRoom.objects.filter(memberships__student=user)

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsTeacher()]
        if self.action == 'join':
            return [permissions.IsAuthenticated(), IsStudent()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsTeacher(), IsClassRoomTeacher()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(detail=False, methods=['post'], url_path='join')
    def join(self, request):
        serializer = ClassRoomJoinSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Entrada na sala de aula realizada com sucesso."},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'], url_path='students')
    def get_students(self, request, pk=None):
        classroom = self.get_object()
        memberships = classroom.memberships.select_related('student').all()
        
        from .serializers import ClassRoomMembershipSerializer
        serializer = ClassRoomMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
