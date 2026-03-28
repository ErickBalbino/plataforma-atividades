from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check():
    return JsonResponse({"status": "healthy"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/v1/accounts/', include('apps.accounts.urls')),
    path('api/v1/classes/', include('apps.classes.urls')),
    path('api/v1/activities/', include('apps.activities.urls')),
    path('api/v1/submissions/', include('apps.submissions.urls')),
]
