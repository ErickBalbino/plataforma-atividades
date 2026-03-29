from rest_framework import permissions

class IsSubmissionStudent(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.student == request.user

class IsSubmissionActivityTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.activity.teacher == request.user

class IsSubmissionOwnerOrTeacher(permissions.BasePermission):
    message = "Você não tem permissão para modificar esta resposta."

    def has_object_permission(self, request, view, obj):
        user = request.user
        if getattr(user, 'role', None) == 'STUDENT':
            return obj.student == user
        elif getattr(user, 'role', None) == 'TEACHER':
            return obj.activity.teacher == user
        return False
