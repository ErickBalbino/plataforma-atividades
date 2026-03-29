from rest_framework import permissions

class IsClassRoomTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.teacher == request.user
