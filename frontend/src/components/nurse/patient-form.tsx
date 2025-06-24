"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format, differenceInYears, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { patientFormSchema, PatientFormValues } from '@/lib/validations';
import { patientApi, Patient } from '@/lib/api';
import { toast } from 'sonner';

interface PatientFormProps {
  patient?: Patient;
  onSuccess?: (patient: Patient) => void;
  onCancel?: () => void;
}

export function PatientForm({ patient, onSuccess, onCancel }: PatientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: undefined,
      phone_number: '',
      email: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      blood_type: '',
      allergies: '',
      medical_history: '',
    },
  });

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      return differenceInYears(today, birthDate);
    } catch (error) {
      return null;
    }
  };

  // Reset form with patient data when patient prop changes
  useEffect(() => {
    if (patient) {
      // Format date for form input
      const formattedDate = patient.date_of_birth 
        ? (typeof patient.date_of_birth === 'string' 
            ? patient.date_of_birth.split('T')[0] 
            : patient.date_of_birth.toISOString().split('T')[0])
        : '';

      form.reset({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        date_of_birth: formattedDate,
        gender: patient.gender || undefined,
        phone_number: patient.phone_number || '',
        email: patient.email || '',
        address: patient.address || '',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_phone: patient.emergency_contact_phone || '',
        blood_type: patient.blood_type || '',
        allergies: patient.allergies || '',
        medical_history: patient.medical_history || '',
      });

      // Calculate age from existing date
      if (formattedDate) {
        const age = calculateAge(formattedDate);
        setCalculatedAge(age);
      }
    } else {
      // Reset form for new patient
      form.reset({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: undefined,
        phone_number: '',
        email: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        blood_type: '',
        allergies: '',
        medical_history: '',
      });
      setCalculatedAge(null);
    }
  }, [patient, form]);

  // Watch for changes in date of birth to calculate age
  const dateOfBirth = form.watch('date_of_birth');
  useEffect(() => {
    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [dateOfBirth]);

  const onSubmit = async (data: PatientFormValues) => {
    setIsLoading(true);
    try {
      let response;
      if (patient) {
        response = await patientApi.updatePatient(patient.patient_id, data);
        toast.success('Patient updated successfully');
      } else {
        response = await patientApi.createPatient(data);
        toast.success('Patient registered successfully');
      }
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      if (!patient) {
        form.reset();
        setCalculatedAge(null);
      }
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{patient ? 'Edit Patient' : 'Register New Patient'}</CardTitle>
        <CardDescription>
          {patient ? 'Update patient information' : 'Enter patient details to create a new record'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Age Display Field */}
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input 
                    value={calculatedAge !== null ? `${calculatedAge} years` : ''} 
                    disabled 
                    placeholder="Auto-calculated"
                    className="bg-gray-50"
                  />
                </FormControl>
              </FormItem>
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="O">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="blood_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter full address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergency_contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter emergency contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergency_contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter emergency contact phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medical Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List any known allergies"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medical_history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter relevant medical history"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {patient ? 'Update Patient' : 'Register Patient'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}