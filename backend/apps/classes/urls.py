from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'classes'

router = DefaultRouter()
# router.register(r'classes', ClassRoomViewSet, basename='classroom')

urlpatterns = [
    path('', include(router.urls)),
]
