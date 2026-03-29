from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings
from .serializers import UserSerializer, LoginSerializer

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == 'login':
            return LoginSerializer
        return UserSerializer

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response_data = {
            'user': UserSerializer(user).data,
            'access': access_token,
            'refresh': refresh_token,
        }

        response = Response(response_data, status=status.HTTP_200_OK)

        secure_cookie = settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False)
        
        response.set_cookie(
            key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'),
            value=access_token,
            httponly=True,
            secure=secure_cookie,
            samesite='Lax',
            path='/'
        )
        
        response.set_cookie(
            key=settings.SIMPLE_JWT.get('AUTH_REFRESH_COOKIE', 'refresh_token'),
            value=refresh_token,
            httponly=True,
            secure=secure_cookie,
            samesite='Lax',
            path='/'
        )
        
        return response

    @action(detail=False, methods=['post'], url_path='refresh')
    def refresh(self, request):
        refresh_cookie_name = settings.SIMPLE_JWT.get('AUTH_REFRESH_COOKIE', 'refresh_token')
        raw_refresh_token = request.COOKIES.get(refresh_cookie_name)
        
        if not raw_refresh_token:
            return Response({'detail': 'Refresh token ausente.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            refresh = RefreshToken(raw_refresh_token)
            access_token = str(refresh.access_token)
        except (InvalidToken, TokenError):
            return Response({'detail': 'Refresh token inválido ou expirado.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        response = Response({'access': access_token}, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'),
            value=access_token,
            httponly=True,
            secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
            samesite='Lax',
            path='/'
        )
        return response

    @action(detail=False, methods=['post'], url_path='logout', permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        response = Response({'detail': 'Logout realizado com sucesso.'}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'))
        response.delete_cookie(settings.SIMPLE_JWT.get('AUTH_REFRESH_COOKIE', 'refresh_token'))
        return response

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        return Response(UserSerializer(request.user).data)
