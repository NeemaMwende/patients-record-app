from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import Patient, User
from .serializers import PatientSerializer, PatientListSerializer, UserRegistrationSerializer, UserLoginSerializer
from django.shortcuts import redirect
import json

class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PatientListSerializer
        return PatientSerializer
    
    def get_queryset(self):
        queryset = Patient.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(patient_id__icontains=search) |
                Q(phone_number__icontains=search)
            )
        return queryset

class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = 'patient_id'

@api_view(['GET'])
def patient_stats(request):
    total_patients = Patient.objects.count()
    male_patients = Patient.objects.filter(gender='M').count()
    female_patients = Patient.objects.filter(gender='F').count()
    
    return Response({
        'total_patients': total_patients,
        'male_patients': male_patients,
        'female_patients': female_patients,
    })

# New Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    """
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            return Response({
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                },
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token,
                }
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': 'Registration failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': 'Registration failed',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Authenticate user and return JWT tokens
    """
    try:
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Authenticate user
            user = authenticate(username=email, password=password)
            
            if user:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                # Determine dashboard URL based on role
                dashboard_urls = {
                    'doctor': '/doctor-dashboard',
                    'nurse': '/dashboard',
                    'admin': '/admin-dashboard',
                    'patient': '/patient-dashboard',
                }
                dashboard_url = dashboard_urls.get(user.role, '/dashboard')
                
                return Response({
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'role': user.role,
                    },
                    'tokens': {
                        'access': access_token,
                        'refresh': refresh_token,
                    },
                    'dashboard_url': dashboard_url
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials',
                    'message': 'Email or password is incorrect'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'error': 'Invalid input',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': 'Login failed',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def logout_user(request):
    """
    Logout user by blacklisting the refresh token
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({
                'message': 'Successfully logged out'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Refresh token required'
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': 'Logout failed',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_profile(request):
    """
    Get current user profile
    """
    if request.user.is_authenticated:
        return Response({
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'role': request.user.role,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)

def login_success(request):
    """
    Redirect function for successful login (if using Django's built-in auth)
    """
    if request.user.role == 'doctor':
        return redirect('doctor_dashboard')
    elif request.user.role == 'nurse':
        return redirect('nurse_dashboard')
    elif request.user.role == 'admin':
        return redirect('admin_dashboard')
    elif request.user.role == 'patient':
        return redirect('patient_dashboard')
    else:
        return redirect('home')