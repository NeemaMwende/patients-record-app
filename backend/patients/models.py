from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    BLOOD_TYPE_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]
    
    patient_id = models.CharField(max_length=20, unique=True, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$')
    phone_number = models.CharField(validators=[phone_regex], max_length=17)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(validators=[phone_regex], max_length=17)
    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPE_CHOICES, blank=True)
    allergies = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.patient_id:
            # Generate patient ID: PAT + year + sequential number
            import datetime
            year = datetime.datetime.now().year
            last_patient = Patient.objects.filter(
                patient_id__startswith=f'PAT{year}'
            ).order_by('patient_id').last()
            
            if last_patient:
                last_number = int(last_patient.patient_id[-4:])
                new_number = last_number + 1
            else:
                new_number = 1
                
            self.patient_id = f'PAT{year}{new_number:04d}'
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.patient_id} - {self.first_name} {self.last_name}"
    
    class Meta:
        ordering = ['-created_at']

class User(AbstractUser):
    """Extended user model for patients and doctors"""
    USER_TYPES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
        ('nurse', 'Nurse'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='patient')
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    blood_type = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    medications = models.TextField(blank=True)
    medical_conditions = models.TextField(blank=True)
    insurance = models.CharField(max_length=200, blank=True)
    member_since = models.DateField(auto_now_add=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    hospital = models.CharField(max_length=200)
    office_location = models.CharField(max_length=200)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name} - {self.specialty}"

class Appointment(models.Model):
    APPOINTMENT_TYPES = (
        ('in_person', 'In-Person'),
        ('video_call', 'Video Call'),
        ('phone_call', 'Phone Call'),
    )
    
    APPOINTMENT_STATUS = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('no_show', 'No Show'),
    )
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctor_appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    appointment_type = models.CharField(max_length=15, choices=APPOINTMENT_TYPES, default='in_person')
    status = models.CharField(max_length=15, choices=APPOINTMENT_STATUS, default='pending')
    reason = models.TextField()
    duration = models.IntegerField(default=30)  # in minutes
    location = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['appointment_date', 'appointment_time']
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.doctor} on {self.appointment_date}"
    
    @property
    def is_upcoming(self):
        appointment_datetime = timezone.datetime.combine(
            self.appointment_date, 
            self.appointment_time
        )
        return appointment_datetime > timezone.now()

class VitalSigns(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vital_signs')
    blood_pressure_systolic = models.IntegerField(null=True, blank=True)
    blood_pressure_diastolic = models.IntegerField(null=True, blank=True)
    heart_rate = models.IntegerField(null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    temperature = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    recorded_date = models.DateTimeField(auto_now_add=True)
    recorded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recorded_vitals')
    
    class Meta:
        ordering = ['-recorded_date']
        verbose_name_plural = "Vital Signs"
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.recorded_date.date()}"
    
    @property
    def blood_pressure(self):
        if self.blood_pressure_systolic and self.blood_pressure_diastolic:
            return f"{self.blood_pressure_systolic}/{self.blood_pressure_diastolic}"
        return None

class Medication(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='current_medications')
    name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    prescribed_by = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    instructions = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.patient.full_name}"

class MedicationAdherence(models.Model):
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, related_name='adherence_records')
    date = models.DateField()
    taken = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['medication', 'date']
    
    def __str__(self):
        return f"{self.medication.name} - {self.date} - {'Taken' if self.taken else 'Missed'}"

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('appointment', 'Appointment'),
        ('results', 'Results'),
        ('medication', 'Medication'),
        ('general', 'General'),
    )
    
    PRIORITY_LEVELS = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=15, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.full_name}"

class HealthScore(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_scores')
    score = models.IntegerField(default=0)
    calculated_date = models.DateTimeField(auto_now_add=True)
    factors = models.JSONField(default=dict)  # Store factors that contributed to score
    
    class Meta:
        ordering = ['-calculated_date']
    
    def __str__(self):
        return f"{self.patient.full_name} - Score: {self.score}"