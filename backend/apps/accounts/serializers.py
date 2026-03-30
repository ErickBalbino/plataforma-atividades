from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'role')
        read_only_fields = ('id',)

class AuthenticatedUserSerializer(UserSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('role_display',)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError('Credenciais inválidas.')
        else:
            raise serializers.ValidationError('Email e senha são obrigatórios.')

        data['user'] = user
        return data

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=True, max_length=150)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'role')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Este e-mail já está em uso.')
        return value

    def create(self, validated_data):
        name = validated_data.pop('name')
        password = validated_data.pop('password')
        
        username_base = validated_data['email'].split('@')[0]
        username = username_base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{username_base}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=password,
            role=validated_data['role'],
            name=name
        )
        return user
