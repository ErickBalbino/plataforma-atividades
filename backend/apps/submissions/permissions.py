from rest_framework import permissions

class IsSubmissionStudent(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.student == request.user

class IsSubmissionActivityTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.activity.teacher == request.user
