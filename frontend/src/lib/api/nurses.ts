import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export interface Nurse {
    status: string;
    nurse_id: string;
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

export interface NurseFormData {
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

export const nurseApi = {
    // Get all patients
  getNurses: (search?: string) => 
    api.get<Nurse[]>('/api/nurses/', { params: { search } }),
  
  // Get single patient
  getNurse: (nurseId: string) => 
    api.get<Nurse>(`/api/nurses/${nurseId}/`),
  
  // Create patient
  createNurse: (data: NurseFormData) => 
    api.post<Nurse>('/api/nurses/', data),
  
  // Update patient
  updateNurse: (nurseId: string, data: Partial<NurseFormData>) => 
    api.put<Nurse>(`/api/nurses/${nurseId}/`, data),
  
  // Delete patient
  deleteNurse: (nurseId: string) => 
    api.delete(`/api/nurses/${nurseId}/`),
  
  // Get stats
  getStats: () => 
    api.get<{total_nurses: number; male_nurses: number; female_nurses: number}>('/api/stats/'),
};