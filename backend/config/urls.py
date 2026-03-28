from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from apps.activities.views import ActivityViewSet
from apps.submissions.views import SubmissionViewSet

def health_check(request):
    return JsonResponse({"status": "healthy"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    
    path('auth/login/', include('apps.accounts.urls')),
    path('atividades/', include('apps.activities.urls')),
    path('respostas/', include('apps.submissions.urls')),
    
    path('me/atividades', ActivityViewSet.as_view({'get': 'my_activities'}), name='my-atividades'),
    path('me/respostas', SubmissionViewSet.as_view({'get': 'my_submissions'}), name='my-respostas'),
]
