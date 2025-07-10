// lib/types/doctor.ts
export interface Doctor {
    doctor_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    specialization: string;
    license_number: string;
    department: string;
    years_of_experience: number;
    education: string;
    bio?: string;
    consultation_fee: number;
    status: 'active' | 'inactive' | 'on_leave';
    created_at: string;
    updated_at: string;
  }
  
  export interface DoctorSchedule {
    schedule_id: string;
    doctor_id: string;
    day_of_week: number; // 0-6 (Sunday-Saturday)
    start_time: string; // HH:mm format
    end_time: string; // HH:mm format
    is_available: boolean;
    break_start?: string;
    break_end?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface DoctorStats {
    total_doctors: number;
    active_doctors: number;
    on_leave_doctors: number;
    total_patients_assigned: number;
    departments: { name: string; count: number }[];
    specializations: { name: string; count: number }[];
  }
  
  // lib/validations/doctor.ts
  import { z } from 'zod';
  
  export const doctorFormSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
    specialization: z.string().min(1, 'Specialization is required'),
    license_number: z.string().min(1, 'License number is required'),
    department: z.string().min(1, 'Department is required'),
    years_of_experience: z.number().min(0, 'Years of experience must be 0 or greater'),
    education: z.string().min(1, 'Education information is required'),
    bio: z.string().optional(),
    consultation_fee: z.number().min(0, 'Consultation fee must be 0 or greater'),
    status: z.enum(['active', 'inactive', 'on_leave']),
  });
  
  export const scheduleFormSchema = z.object({
    day_of_week: z.number().min(0).max(6),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    is_available: z.boolean(),
    break_start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
    break_end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
  });
  
  export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
  export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
