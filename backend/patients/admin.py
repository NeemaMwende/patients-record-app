from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Patient, User, Doctor, Appointment, VitalSigns, Medication, MedicationAdherence, Notification, HealthScore

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['patient_id', 'first_name', 'last_name', 'gender', 'phone_number', 'created_at']
    list_filter = ['gender', 'blood_type', 'created_at']
    search_fields = ['patient_id', 'first_name', 'last_name', 'phone_number', 'email']
    readonly_fields = ['patient_id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('patient_id', 'first_name', 'last_name', 'date_of_birth', 'gender')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'email', 'address')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone')
        }),
        ('Medical Information', {
            'fields': ('blood_type', 'allergies', 'medical_history')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_active', 'member_since']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Information', {
            'fields': ('role', 'phone', 'date_of_birth', 'address', 'emergency_contact', 
                      'blood_type', 'allergies', 'medications', 'medical_conditions', 
                      'insurance', 'profile_image')
        }),
    )

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialty', 'license_number', 'hospital']
    list_filter = ['specialty', 'hospital']
    search_fields = ['user__first_name', 'user__last_name', 'specialty', 'license_number']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'appointment_date', 'appointment_time', 'status']
    list_filter = ['status', 'appointment_type', 'appointment_date']
    search_fields = ['patient__first_name', 'patient__last_name', 'doctor__user__first_name', 'doctor__user__last_name']
    date_hierarchy = 'appointment_date'

@admin.register(VitalSigns)
class VitalSignsAdmin(admin.ModelAdmin):
    list_display = ['patient', 'blood_pressure', 'heart_rate', 'weight', 'temperature', 'recorded_date']
    list_filter = ['recorded_date', 'recorded_by']
    search_fields = ['patient__first_name', 'patient__last_name']
    date_hierarchy = 'recorded_date'

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'patient', 'dosage', 'frequency', 'is_active', 'prescribed_by']
    list_filter = ['is_active', 'prescribed_by', 'start_date']
    search_fields = ['name', 'patient__first_name', 'patient__last_name']

@admin.register(MedicationAdherence)
class MedicationAdherenceAdmin(admin.ModelAdmin):
    list_display = ['medication', 'date', 'taken']
    list_filter = ['taken', 'date']
    search_fields = ['medication__name', 'medication__patient__first_name', 'medication__patient__last_name']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'priority', 'is_read', 'created_at']
    list_filter = ['notification_type', 'priority', 'is_read', 'created_at']
    search_fields = ['title', 'user__first_name', 'user__last_name']

@admin.register(HealthScore)
class HealthScoreAdmin(admin.ModelAdmin):
    list_display = ['patient', 'score', 'calculated_date']
    list_filter = ['calculated_date', 'score']
    search_fields = ['patient__first_name', 'patient__last_name']