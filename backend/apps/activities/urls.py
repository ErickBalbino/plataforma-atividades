from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'activities'

router = DefaultRouter()
# router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
]
