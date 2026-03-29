from rest_framework import permissions

class IsActivityTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.teacher == request.user

class IsActivityClassroom(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.classroom.memberships.filter(student=request.user).exists()
