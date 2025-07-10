
  // lib/api/doctors.ts
  import { Doctor, DoctorStats, DoctorSchedule } from '@/lib/types/doctor';
  import { DoctorFormValues, ScheduleFormValues } from '@/lib/validations/doctor';
import axios from 'axios';
  
  export const doctorApi = {
    getDoctors: async (search?: string) => {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: [
          {
            doctor_id: 'DOC001',
            first_name: 'John',
            last_name: 'Smith',
            email: 'john.smith@hospital.com',
            phone_number: '+1234567890',
            specialization: 'Cardiology',
            license_number: 'LIC123456',
            department: 'Cardiology',
            years_of_experience: 15,
            education: 'MD from Harvard Medical School',
            bio: 'Experienced cardiologist with expertise in interventional cardiology.',
            consultation_fee: 200,
            status: 'active' as const,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
          },
        ] as Doctor[]
      };
    },
  
    getDoctor: async (doctorId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: {
          doctor_id: doctorId,
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@hospital.com',
          phone_number: '+1234567890',
          specialization: 'Cardiology',
          license_number: 'LIC123456',
          department: 'Cardiology',
          years_of_experience: 15,
          education: 'MD from Harvard Medical School',
          bio: 'Experienced cardiologist with expertise in interventional cardiology.',
          consultation_fee: 200,
          status: 'active' as const,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        } as Doctor
      };
    },
  
    createDoctor: async (data: DoctorFormValues) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: {
          doctor_id: 'DOC' + Math.random().toString(36).substr(2, 9),
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Doctor
      };
    },
  
    updateDoctor: async (doctorId: string, data: DoctorFormValues) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: {
          doctor_id: doctorId,
          ...data,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: new Date().toISOString(),
        } as Doctor
      };
    },
  
    deleteDoctor: async (doctorId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
  
    getStats: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        data: {
          total_doctors: 25,
          active_doctors: 22,
          on_leave_doctors: 3,
          total_patients_assigned: 450,
          departments: [
            { name: 'Cardiology', count: 5 },
            { name: 'Neurology', count: 4 },
            { name: 'Orthopedics', count: 6 },
            { name: 'Pediatrics', count: 4 },
            { name: 'General Medicine', count: 6 },
          ],
          specializations: [
            { name: 'Cardiologist', count: 5 },
            { name: 'Neurologist', count: 4 },
            { name: 'Orthopedic Surgeon', count: 6 },
            { name: 'Pediatrician', count: 4 },
            { name: 'General Practitioner', count: 6 },
          ],
        } as DoctorStats
      };
    },
  
    getDoctorSchedule: async (doctorId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: [
          {
            schedule_id: 'SCH001',
            doctor_id: doctorId,
            day_of_week: 1,
            start_time: '09:00',
            end_time: '17:00',
            is_available: true,
            break_start: '12:00',
            break_end: '13:00',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
          },
        ] as DoctorSchedule[]
      };
    },
  
    updateDoctorSchedule: async (doctorId: string, schedules: ScheduleFormValues[]) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: schedules.map((schedule, index) => ({
          schedule_id: 'SCH' + (index + 1).toString().padStart(3, '0'),
          doctor_id: doctorId,
          ...schedule,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: new Date().toISOString(),
        })) as DoctorSchedule[]
      };
    },

    getRecentAppointments: async (doctorId: string) => {
      const response = await axios.get(`/api/doctors/${doctorId}/appointments/recent`);
      return response.data;
    },
  };