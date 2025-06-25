import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export interface Admin {
    status: string;
    admin_id: string;
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

export interface AdminFormData {
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

export const adminApi = {
    // Get all patients
  getPatients: (search?: string) => 
    api.get<Admin[]>('/api/admins/', { params: { search } }),
  
  // Get single patient
  getPatient: (patientId: string) => 
    api.get<Admin>(`/api/admins/${patientId}/`),
  
  // Create patient
  createPatient: (data: AdminFormData) => 
    api.post<Admin>('/api/admins/', data),
  
  // Update patient
  updatePatient: (adminId: string, data: Partial<AdminFormData>) => 
    api.put<Admin>(`/api/admins/${adminId}/`, data),
  
  // Delete patient
  deletePatient: (adminId: string) => 
    api.delete(`/api/admin/${adminId}/`),
  
  // Get stats
  getStats: () => 
    api.get<{total_patients: number; male_patients: number; female_patients: number}>('/api/stats/'),
};