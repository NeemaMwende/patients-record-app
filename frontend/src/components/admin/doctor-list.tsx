"use client"

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Download,
  MoreHorizontal,
  Stethoscope,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

import { doctorApi } from '@/lib/api/doctors';
import { Doctor } from '@/lib/types/doctor';
import { DoctorForm } from './doctor-form';
import { toast } from 'sonner';

interface DoctorListProps {
  onAddDoctor?: () => void;
}

export function DoctorList({ onAddDoctor }: DoctorListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorApi.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowEditDialog(true);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowViewDialog(true);
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      await doctorApi.deleteDoctor(doctorId);
      setDoctors(doctors.filter(d => d.doctor_id !== doctorId));
      toast.success('Doctor deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleUpdateSuccess = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map(d => 
      d.doctor_id === updatedDoctor.doctor_id ? updatedDoctor : d
    ));
    setShowEditDialog(false);
    setSelectedDoctor(null);
  };

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.license_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || doctor.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || doctor.department === filterDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'on_leave':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const uniqueDepartments = [...new Set(doctors.map(d => d.department))];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Doctor Records</h2>
          <p className="text-muted-foreground">
            Manage and view all registered doctors ({filteredDoctors.length} total)
          </p>
        </div>
        <Button onClick={onAddDoctor} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Doctor
        </Button>
      </div>
  
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors by name, specialization, email, or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
  
      {/* Doctors Table */}
      {filteredDoctors.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first doctor.'}
            </p>
            {(!searchTerm && filterStatus === 'all' && filterDepartment === 'all') && (
              <Button onClick={onAddDoctor}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Doctor
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.doctor_id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    {getStatusBadge(doctor.status)}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDoctor(doctor)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditDoctor(doctor)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteConfirm(doctor.doctor_id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
  
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>
              Update doctor information and credentials
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <DoctorForm
              doctor={selectedDoctor}
              onSuccess={handleUpdateSuccess}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedDoctor(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
  
      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedDoctor.specialization}</p>
                  {getStatusBadge(selectedDoctor.status)}
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedDoctor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedDoctor.phone_number}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedDoctor.department}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedDoctor.years_of_experience} years experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">${selectedDoctor.consultation_fee}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">License: {selectedDoctor.license_number}</span>
                  </div>
                </div>
              </div>
  
              <div className="space-y-2">
                <h4 className="font-medium">Education</h4>
                <p className="text-sm text-gray-600">{selectedDoctor.education}</p>
              </div>
  
              {selectedDoctor.bio && (
                <div className="space-y-2">
                  <h4 className="font-medium">Biography</h4>
                  <p className="text-sm text-gray-600">{selectedDoctor.bio}</p>
                </div>
              )}
  
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowViewDialog(false);
                  handleEditDoctor(selectedDoctor);
                }}>
                  Edit Doctor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
  
      {/* Delete Confirmation */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Doctor</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this doctor? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteDoctor(deleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
  