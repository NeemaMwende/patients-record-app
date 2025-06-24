from django.urls import path
from . import views

urlpatterns = [
    # Patient endpoints
    path('patients/', views.PatientListCreateView.as_view(), name='patient-list-create'),
    path('patients/<str:patient_id>/', views.PatientDetailView.as_view(), name='patient-detail'),
    path('stats/', views.patient_stats, name='patient-stats'),
    
    # Authentication endpoints
    path('auth/register/', views.register_user, name='register-user'),
    path('auth/login/', views.login_user, name='login-user'),
    path('auth/logout/', views.logout_user, name='logout-user'),
    path('auth/profile/', views.user_profile, name='user-profile'),
    
    # Utility endpoints
    path('login-success/', views.login_success, name='login_success'),
    
    # Future endpoints (commented out for now)
    # path('doctors/', views.doctor_list, name='doctor-list'),    
    # path('admin/', views.admin-dashboard, name='admin-dashboard'),
]