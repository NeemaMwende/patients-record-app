# Run this with: python manage.py shell < test_db_sync.py

from django.db import connection
from patients.models import Patient, User 

# Test database connection
def test_db_connection():
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            print(f"✅ Database connection successful: {result}")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

# Test Patient model
def test_patient_model():
    try:
        # Create a test patient
        patient = Patient.objects.create(
            first_name="Test",
            last_name="Patient",
            date_of_birth="1990-01-01",
            gender="M",
            phone_number="+254712345678",
            email="test@example.com",
            address="123 Test Street, Nairobi",
            emergency_contact_name="John Doe",
            emergency_contact_phone="+254712345679",
            blood_type="O+",
            allergies="None",
            medical_history="None"
        )
        
        print(f"✅ Patient created successfully: {patient}")
        
        # Verify patient can be retrieved
        retrieved_patient = Patient.objects.get(patient_id=patient.patient_id)
        print(f"✅ Patient retrieved successfully: {retrieved_patient}")
        
        # Clean up
        # patient.delete()
        # print("✅ Test patient deleted")
        
    except Exception as e:
        print(f"❌ Patient model test failed: {e}")

# Test User model
def test_user_model():
    try:
        # Create a test user
        user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            first_name="Test",
            last_name="User",
            password="testpass123",
            role="patient"
        )
        
        print(f"✅ User created successfully: {user}")
        
        # Verify user can be retrieved
        retrieved_user = User.objects.get(email=user.email)
        print(f"✅ User retrieved successfully: {retrieved_user}")
        
        # Clean up
        user.delete()
        print("✅ Test user deleted")
        
    except Exception as e:
        print(f"❌ User model test failed: {e}")

# Run tests
print("🔍 Testing database synchronization...")
test_db_connection()
test_patient_model()
test_user_model()
print("✅ Database synchronization tests completed!")

# Check current data counts
print(f"\n📊 Current data counts:")
print(f"Patients: {Patient.objects.count()}")
print(f"Users: {User.objects.count()}")

# List all patients
print(f"\n📋 All patients in database:")
for patient in Patient.objects.all():
    print(f"  - {patient}")

# List all users
print(f"\n👥 All users in database:")
for user in User.objects.all():
    print(f"  - {user} ({user.role})")