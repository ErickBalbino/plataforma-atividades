from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'submissions'

router = DefaultRouter()
# router.register(r'submissions', SubmissionViewSet, basename='submission')

urlpatterns = [
    path('', include(router.urls)),
]
