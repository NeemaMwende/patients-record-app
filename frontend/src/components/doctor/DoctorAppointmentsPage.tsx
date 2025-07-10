"use client"

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  duration: number; // in minutes
}

export function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAppointments: Appointment[] = [
          {
            id: '1',
            patient_name: 'John Doe',
            patient_phone: '+1234567890',
            date: '2024-01-25',
            time: '09:00',
            type: 'Consultation',
            status: 'scheduled',
            duration: 30,
            notes: 'Follow-up for hypertension'
          },
          {
            id: '2',
            patient_name: 'Jane Smith',
            patient_phone: '+1234567891',
            date: '2024-01-25',
            time: '10:30',
            type: 'Check-up',
            status: 'scheduled',
            duration: 45,
          },
          {
            id: '3',
            patient_name: 'Mike Johnson',
            patient_phone: '+1234567892',
            date: '2024-01-25',
            time: '14:00',
            type: 'Consultation',
            status: 'completed',
            duration: 30,
            notes: 'Asthma management review'
          },
          {
            id: '4',
            patient_name: 'Sarah Wilson',
            patient_phone: '+1234567893',
            date: '2024-01-26',
            time: '09:30',
            type: 'Follow-up',
            status: 'scheduled',
            duration: 30,
          },
          {
            id: '5',
            patient_name: 'David Brown',
            patient_phone: '+1234567894',
            date: '2024-01-24',
            time: '11:00',
            type: 'Consultation',
            status: 'no-show',
            duration: 30,
          },
        ];
        
        setAppointments(mockAppointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'no-show':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const updateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  const filterAppointments = (filterType: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    switch (filterType) {
      case 'today':
        return appointments.filter(apt => apt.date === today);
      case 'tomorrow':
        return appointments.filter(apt => apt.date === tomorrow);
      case 'upcoming':
        return appointments.filter(apt => apt.date > today && apt.status === 'scheduled');
      case 'completed':
        return appointments.filter(apt => apt.status === 'completed');
      case 'all':
      default:
        return appointments;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
        <p className="text-muted-foreground">
          Manage your scheduled appointments and consultations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filterAppointments(activeTab).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments found for this period.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filterAppointments(activeTab).map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <h3 className="text-lg font-semibold">{appointment.patient_name}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(appointment.status)}
                              {appointment.status}
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time} ({appointment.duration} min)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{appointment.patient_phone}</span>
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {appointment.type}
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="text-sm">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            View Notes
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filterAppointments('today').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(apt => apt.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">No Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {appointments.filter(apt => apt.status === 'no-show').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}