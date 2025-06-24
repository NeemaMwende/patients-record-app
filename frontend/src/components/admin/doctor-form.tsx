"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Stethoscope, GraduationCap, Building2, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { doctorFormSchema, DoctorFormValues } from '@/lib/validations/doctor';
import { doctorApi } from '@/lib/api/doctors';
import { Doctor } from '@/lib/types/doctor';
import { toast } from 'sonner';

interface DoctorFormProps {
  doctor?: Doctor;
  onSuccess?: (doctor: Doctor) => void;
  onCancel?: () => void;
}

const specializations = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Family Medicine',
  'Gastroenterology',
  'General Surgery',
  'Hematology',
  'Infectious Disease',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Neurosurgery',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology',
  'Pathology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Urology',
];

const departments = [
  'Cardiology',
  'Dermatology',
  'Emergency',
  'Endocrinology',
  'Family Medicine',
  'Gastroenterology',
  'General Surgery',
  'Hematology',
  'Infectious Disease',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Neurosurgery',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology',
  'Pathology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Urology',
];

export function DoctorForm({ doctor, onSuccess, onCancel }: DoctorFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      specialization: '',
      license_number: '',
      department: '',
      years_of_experience: 0,
      education: '',
      bio: '',
      consultation_fee: 0,
      status: 'active',
    },
  });

  // Reset form with doctor data when doctor prop changes
  useEffect(() => {
    if (doctor) {
      form.reset({
        first_name: doctor.first_name || '',
        last_name: doctor.last_name || '',
        email: doctor.email || '',
        phone_number: doctor.phone_number || '',
        specialization: doctor.specialization || '',
        license_number: doctor.license_number || '',
        department: doctor.department || '',
        years_of_experience: doctor.years_of_experience || 0,
        education: doctor.education || '',
        bio: doctor.bio || '',
        consultation_fee: doctor.consultation_fee || 0,
        status: doctor.status || 'active',
      });
    } else {
      form.reset({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        specialization: '',
        license_number: '',
        department: '',
        years_of_experience: 0,
        education: '',
        bio: '',
        consultation_fee: 0,
        status: 'active',
      });
    }
  }, [doctor, form]);

  const onSubmit = async (data: DoctorFormValues) => {
    setIsLoading(true);
    try {
      let response;
      if (doctor) {
        response = await doctorApi.updateDoctor(doctor.doctor_id, data);
        toast.success('Doctor updated successfully');
      } else {
        response = await doctorApi.createDoctor(data);
        toast.success('Doctor registered successfully');
      }
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      if (!doctor) {
        form.reset();
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
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Stethoscope className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>{doctor ? 'Edit Doctor' : 'Register New Doctor'}</CardTitle>
            <CardDescription>
              {doctor ? 'Update doctor information and credentials' : 'Enter doctor details to create a new record'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <h3 className="text-lg font-semibold">Professional Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specializations.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="license_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter license number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="years_of_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Education & Bio */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <h3 className="text-lg font-semibold">Education & Bio</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter education background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief biography" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Fee & Status */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <h3 className="text-lg font-semibold">Consultation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="consultation_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Fee (Ksh)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {doctor ? 'Update Doctor' : 'Register Doctor'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
          