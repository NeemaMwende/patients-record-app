import { z } from 'zod';

export const patientFormSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['M', 'F', 'O'], {
    required_error: 'Please select a gender',
  }),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  emergency_contact_name: z.string().min(2, 'Emergency contact name is required'),
  emergency_contact_phone: z.string().min(10, 'Emergency contact phone is required'),
  blood_type: z.string().optional(),
  allergies: z.string().optional(),
  medical_history: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

// Login form validation schema
export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

// Registration form validation schema
export const registerFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['admin', 'doctor', 'nurse', 'patient'], {
    required_error: 'Role is required',
  }),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;