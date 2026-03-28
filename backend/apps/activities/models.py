from django.db import models
from django.conf import settings

class Activity(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    classroom = models.ForeignKey(
        'classes.ClassRoom',
        on_delete=models.CASCADE,
        related_name='activities'
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_activities'
    )
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
