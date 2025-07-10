import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export interface Patient {
    status: string;
    patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | Date | null;
  gender: 'M' | 'F' | 'O';
  phone_number: string;
  email?: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
  created_at: string;
  updated_at: string;
  age: number;
}

export interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  phone_number: string;
  email?: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
}

export const patientApi = {
    // Get all patients
  getPatients: (search?: string) => 
    api.get<Patient[]>('/api/patients/', { params: { search } }),
  
  // Get single patient
  getPatient: (patientId: string) => 
    api.get<Patient>(`/api/patients/${patientId}/`),
  
  // Create patient
  createPatient: (data: PatientFormData) => 
    api.post<Patient>('/api/patients/', data),
  
  // Update patient
  updatePatient: (patientId: string, data: Partial<PatientFormData>) => 
    api.put<Patient>(`/api/patients/${patientId}/`, data),
  
  // Delete patient
  deletePatient: (patientId: string) => 
    api.delete(`/api/patients/${patientId}/`),
  
  // Get stats
  getStats: () => 
    api.get<{total_patients: number; male_patients: number; female_patients: number}>('/api/stats/'),
};
