import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Video,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  Stethoscope,
  Building
} from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialty: 'Cardiologist',
      doctorImage: '/api/placeholder/50/50',
      date: '2024-07-15',
      time: '10:30 AM',
      type: 'In-Person',
      location: 'Cardiology Wing, Room 205',
      hospital: 'Springfield Medical Center',
      status: 'confirmed',
      reason: 'Annual cardiac checkup',
      duration: '45 minutes',
      notes: 'Please bring previous ECG reports'
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      doctorSpecialty: 'Endocrinologist',
      doctorImage: '/api/placeholder/50/50',
      date: '2024-07-22',
      time: '2:15 PM',
      type: 'Video Call',
      location: 'Virtual Consultation',
      hospital: 'Springfield Medical Center',
      status: 'confirmed',
      reason: 'Diabetes management follow-up',
      duration: '30 minutes',
      notes: 'Review recent blood glucose logs'
    },
    {
      id: 3,
      doctorName: 'Dr. Sarah Williams',
      doctorSpecialty: 'General Practitioner',
      doctorImage: '/api/placeholder/50/50',
      date: '2024-08-05',
      time: '9:00 AM',
      type: 'In-Person',
      location: 'Primary Care, Room 102',
      hospital: 'Springfield Medical Center',
      status: 'pending',
      reason: 'Annual physical examination',
      duration: '60 minutes',
      notes: 'Fasting required - no food 12 hours before'
    }
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    reason: ''
  });
  const [cancelReason, setCancelReason] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      date: appointment.date,
      time: appointment.time,
      reason: ''
    });
    setIsRescheduleOpen(true);
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason('');
    setIsCancelOpen(true);
  };

  const confirmReschedule = () => {
    // Update appointment with new date/time
    setAppointments(prev => prev.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...apt, date: rescheduleData.date, time: rescheduleData.time, status: 'pending' }
        : apt
    ));
    setIsRescheduleOpen(false);
    setSelectedAppointment(null);
    // Here you would make an API call to your Django backend
    console.log('Rescheduling appointment:', selectedAppointment.id, rescheduleData);
  };

  const confirmCancel = () => {
    // Update appointment status to cancelled
    setAppointments(prev => prev.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...apt, status: 'cancelled' }
        : apt
    ));
    setIsCancelOpen(false);
    setSelectedAppointment(null);
    // Here you would make an API call to your Django backend
    console.log('Cancelling appointment:', selectedAppointment.id, cancelReason);
  };

  const upcomingAppointments = appointments.filter(apt => apt.status !== 'cancelled');
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-1">View and manage your upcoming medical appointments</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </div>

        {/* Next Appointment Card */}
        {nextAppointment && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-700 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Next Appointment
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Your upcoming appointment details
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(nextAppointment.status)} flex items-center gap-1`}>
                  {getStatusIcon(nextAppointment.status)}
                  {nextAppointment.status.charAt(0).toUpperCase() + nextAppointment.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={nextAppointment.doctorImage} alt={nextAppointment.doctorName} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {nextAppointment.doctorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{nextAppointment.doctorName}</h3>
                      <p className="text-blue-600 flex items-center">
                        <Stethoscope className="w-4 h-4 mr-1" />
                        {nextAppointment.doctorSpecialty}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {nextAppointment.hospital}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <span className="font-medium">{formatDate(nextAppointment.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{nextAppointment.time} ({nextAppointment.duration})</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    {nextAppointment.type === 'Video Call' ? (
                      <Video className="w-5 h-5 mr-3 text-blue-500" />
                    ) : (
                      <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                    )}
                    <span>{nextAppointment.location}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Reason:</strong> {nextAppointment.reason}
                    </p>
                    {nextAppointment.notes && (
                      <p className="text-sm text-blue-600 mt-1">
                        <strong>Note:</strong> {nextAppointment.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Appointments */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              All Appointments
            </CardTitle>
            <CardDescription>Complete list of your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <div key={appointment.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={appointment.doctorImage} alt={appointment.doctorName} />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">{appointment.doctorName}</h4>
                          <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1 text-xs`}>
                            {getStatusIcon(appointment.status)}
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{appointment.doctorSpecialty}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(appointment.date)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time}
                          </span>
                          <span className="flex items-center">
                            {appointment.type === 'Video Call' ? (
                              <Video className="w-4 h-4 mr-1" />
                            ) : (
                              <MapPin className="w-4 h-4 mr-1" />
                            )}
                            {appointment.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {appointment.status !== 'cancelled' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReschedule(appointment)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(appointment)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  {index < appointments.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reschedule Dialog */}
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit3 className="w-5 h-5 mr-2" />
                Reschedule Appointment
              </DialogTitle>
              <DialogDescription>
                Select a new date and time for your appointment with {selectedAppointment?.doctorName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="new-date">New Date</Label>
                <Input
                  id="new-date"
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-time">Preferred Time</Label>
                <Select value={rescheduleData.time} onValueChange={(value) => setRescheduleData(prev => ({ ...prev, time: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    <SelectItem value="9:30 AM">9:30 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                    <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                    <SelectItem value="2:30 PM">2:30 PM</SelectItem>
                    <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                    <SelectItem value="3:30 PM">3:30 PM</SelectItem>
                    <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                    <SelectItem value="4:30 PM">4:30 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reschedule-reason">Reason for Rescheduling (Optional)</Label>
                <Textarea
                  id="reschedule-reason"
                  placeholder="Please provide a reason for rescheduling..."
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmReschedule} className="bg-blue-600 hover:bg-blue-700">
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <XCircle className="w-5 h-5 mr-2" />
                Cancel Appointment
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your appointment with {selectedAppointment?.doctorName} on {selectedAppointment && formatDate(selectedAppointment.date)}?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="cancel-reason">Reason for Cancellation</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please provide a reason for cancelling..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
                Keep Appointment
              </Button>
              <Button onClick={confirmCancel} variant="destructive">
                Cancel Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'confirmed').length}
              </h3>
              <p className="text-gray-600">Confirmed Appointments</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'pending').length}
              </h3>
              <p className="text-gray-600">Pending Confirmation</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.type === 'Video Call').length}
              </h3>
              <p className="text-gray-600">Virtual Appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Need Help?</h3>
                <p className="text-gray-600">
                  Contact our support team for assistance with your appointments
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Live Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;