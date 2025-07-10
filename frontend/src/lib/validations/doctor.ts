import { z } from 'zod';

// Doctor Form Schema
export const doctorFormSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  specialization: z.string().min(2, 'Specialization is required'),
  license_number: z.string().min(5, 'License number is required'),
  department: z.string().min(2, 'Department is required'),
  years_of_experience: z.number().min(0, 'Experience must be a positive number'),
  education: z.string().min(5, 'Education information is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  consultation_fee: z.number().min(0, 'Fee must be a positive number'),
  status: z.enum(['active', 'inactive', 'on_leave'], {
    required_error: 'Status is required',
  }),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;

// Schedule Form Schema
export const scheduleFormSchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time'),
  is_available: z.boolean(),
  break_start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid break start time'),
  break_end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid break end time'),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
