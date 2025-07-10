// lib/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types
export interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | Date;
  gender: 'M' | 'F' | 'O';
  phone_number: string;
  email?: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
  age: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface CreatePatientData {
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

export interface PatientStats {
  total_patients: number;
  male_patients: number;
  female_patients: number;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
  dashboard_url?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  role: string;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },
  
  setAccessToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },
  
  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  },
  
  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  
  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const newAccessToken = response.data.access;
          tokenManager.setAccessToken(newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          tokenManager.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        tokenManager.clearTokens();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Patient API endpoints
export const patientApi = {
  // Get all patients with optional search
  getPatients: async (search?: string): Promise<AxiosResponse<Patient[]>> => {
    const params = search ? { search } : {};
    return apiClient.get('/patients/', { params });
  },

  // Get single patient by ID
  getPatient: async (patientId: string): Promise<AxiosResponse<Patient>> => {
    return apiClient.get(`/patients/${patientId}/`);
  },

  // Create new patient
  createPatient: async (data: CreatePatientData): Promise<AxiosResponse<Patient>> => {
    return apiClient.post('/patients/', data);
  },

  // Update patient
  updatePatient: async (patientId: string, data: Partial<CreatePatientData>): Promise<AxiosResponse<Patient>> => {
    return apiClient.patch(`/patients/${patientId}/`, data);
  },

  // Delete patient
  deletePatient: async (patientId: string): Promise<AxiosResponse<void>> => {
    return apiClient.delete(`/patients/${patientId}/`);
  },

  // Get patient statistics
  getPatientStats: async (): Promise<AxiosResponse<PatientStats>> => {
    return apiClient.get('/stats/');
  },
};

// Authentication API endpoints
export const authApi = {
  // Login user
  login: async (data: LoginData): Promise<AxiosResponse<AuthResponse>> => {
    return apiClient.post('/auth/login/', data);
  },

  // Register user
  register: async (data: RegisterData): Promise<AxiosResponse<AuthResponse>> => {
    return apiClient.post('/auth/register/', data);
  },

  // Logout user
  logout: async (): Promise<AxiosResponse<{ message: string }>> => {
    const refreshToken = tokenManager.getRefreshToken();
    return apiClient.post('/auth/logout/', { refresh_token: refreshToken });
  },

  // Get user profile
  getProfile: async (): Promise<AxiosResponse<{ user: AuthResponse['user'] }>> => {
    return apiClient.get('/auth/profile/');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AxiosResponse<{ access: string }>> => {
    return apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
  },
};

// Utility functions
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.details) {
    // Handle validation errors
    const details = error.response.data.details;
    const firstError = Object.values(details)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default apiClient;