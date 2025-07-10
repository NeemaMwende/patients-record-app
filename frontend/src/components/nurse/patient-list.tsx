"use client"

import { useState, useEffect, useRef } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { Search, Eye, Edit, Trash2, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { patientApi, Patient } from '@/lib/api';
import { toast } from 'sonner';
import { PatientForm } from './patient-form';

interface PatientListProps {
  onPatientSelect?: (patient: Patient) => void;
  showActions?: boolean;
}

// Helper function to safely format dates
const safeFormatDate = (dateValue: string | Date | null | undefined, formatStr: string = 'MMM dd, yyyy'): string => {
  if (!dateValue) return 'N/A';
  
  try {
    let date: Date;
    
    if (typeof dateValue === 'string') {
      // Try parsing ISO string first, then regular Date constructor
      date = dateValue.includes('T') ? parseISO(dateValue) : new Date(dateValue);
    } else {
      date = dateValue;
    }
    
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    
    return format(date, formatStr);
  } catch (error) {
    console.warn('Date formatting error:', error, 'for value:', dateValue);
    return 'Invalid Date';
  }
};

export function PatientList({ onPatientSelect, showActions = true }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  
  // Use useRef to store the debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPatients = async (search?: string) => {
    try {
      setLoading(true);
      const response = await patientApi.getPatients(search);
      setPatients(response.data);
    } catch (error) {
        toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchPatients(value);
    }, 300);
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleDeletePatient = async (patientId: string) => {
    try {
      await patientApi.deletePatient(patientId);
      toast.success('Patient deleted successfully');
      fetchPatients(searchTerm);
    } catch (error) {
        toast.error('Failed to delete patient');
    }
  };

  const handleEditSuccess = (updatedPatient: Patient) => {
    setShowEditDialog(false);
    setSelectedPatient(null);
    fetchPatients(searchTerm);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowViewDialog(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditDialog(true);
  };

  const getGenderBadge = (gender: string) => {
    const colors = {
      M: 'bg-blue-100 text-blue-800',
      F: 'bg-pink-100 text-pink-800',
      O: 'bg-gray-100 text-gray-800',
    };
    const labels = { M: 'Male', F: 'Female', O: 'Other' };
    
    return (
      <Badge className={colors[gender as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {labels[gender as keyof typeof labels] || 'Unknown'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>
              Manage and view patient information
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {patients.length} patients
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {patients.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No patients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by registering a new patient.'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered</TableHead>
                  {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow 
                    key={patient.patient_id}
                    className={onPatientSelect ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => onPatientSelect?.(patient)}
                  >
                    <TableCell className="font-medium">{patient.patient_id}</TableCell>
                    <TableCell>
                      {patient.first_name} {patient.last_name}
                    </TableCell>
                    <TableCell>{patient.age} years</TableCell>
                    <TableCell>{getGenderBadge(patient.gender)}</TableCell>
                    <TableCell>{patient.phone_number}</TableCell>
                    <TableCell>{patient.email || 'N/A'}</TableCell>
                    <TableCell>
                      {safeFormatDate(patient.created_at)}
                    </TableCell>
                    {showActions && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPatient(patient);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPatient(patient);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {patient.first_name} {patient.last_name}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePatient(patient.patient_id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* View Patient Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedPatient?.first_name} {selectedPatient?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedPatient && <PatientDetailsView patient={selectedPatient} />}
          </DialogContent>
        </Dialog>

        {/* Edit Patient Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPatient && (
              <PatientForm
                patient={selectedPatient}
                onSuccess={handleEditSuccess}
                onCancel={() => {
                  setShowEditDialog(false);
                  setSelectedPatient(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function PatientDetailsView({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Patient ID</label>
          <p className="text-sm">{patient.patient_id}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Full Name</label>
          <p className="text-sm">{patient.first_name} {patient.last_name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Date of Birth</label>
          <p className="text-sm">{safeFormatDate(patient.date_of_birth, 'MMMM dd, yyyy')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Age</label>
          <p className="text-sm">{patient.age} years</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Gender</label>
          <p className="text-sm">{patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Blood Type</label>
          <p className="text-sm">{patient.blood_type || 'Not specified'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Phone Number</label>
          <p className="text-sm">{patient.phone_number}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-sm">{patient.email || 'Not provided'}</p>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-500">Address</label>
        <p className="text-sm">{patient.address}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
          <p className="text-sm">{patient.emergency_contact_name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Emergency Phone</label>
          <p className="text-sm">{patient.emergency_contact_phone}</p>
        </div>
      </div>
      
      {patient.allergies && (
        <div>
          <label className="text-sm font-medium text-gray-500">Allergies</label>
          <p className="text-sm">{patient.allergies}</p>
        </div>
      )}
      
      {patient.medical_history && (
        <div>
          <label className="text-sm font-medium text-gray-500">Medical History</label>
          <p className="text-sm">{patient.medical_history}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label className="text-sm font-medium text-gray-500">Registered</label>
          <p className="text-sm">{safeFormatDate(patient.created_at, 'MMMM dd, yyyy HH:mm')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Last Updated</label>
          <p className="text-sm">{safeFormatDate(patient.updated_at, 'MMMM dd, yyyy HH:mm')}</p>
        </div>
      </div>
    </div>
  );
}