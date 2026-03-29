from rest_framework import viewsets, permissions
from .models import ClassRoom
from .serializers import ClassRoomSerializer

class ClassRoomViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = ClassRoom.objects.all()
    serializer_class = ClassRoomSerializer
