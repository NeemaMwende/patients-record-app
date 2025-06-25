"use client"

import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, Stethoscope, FileText, Activity, TrendingUp, Heart, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { doctorApi } from '@/lib/api/doctors';

interface DoctorDashboardStats {
  total_patients: number;
  todays_appointments: number;
  pending_appointments: number;
  completed_consultations: number;
}

interface RecentAppointment {
  id: string;
  patient_name: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export function DoctorDashboard() {
  const [stats, setStats] = useState<DoctorDashboardStats>({
    total_patients: 0,
    todays_appointments: 0,
    pending_appointments: 0,
    completed_consultations: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock doctor ID - in real app this would come from auth context
        const doctorId = 'DOC001';
        
        const [statsResponse, appointmentsResponse] = await Promise.all([
          // Mock the stats data since the API returns different structure
          Promise.resolve({
            data: {
              total_patients: 87,
              todays_appointments: 12,
              pending_appointments: 8,
              completed_consultations: 145,
            } as DoctorDashboardStats
          }),
          // Mock recent appointments since the API call needs doctorId
          Promise.resolve({
            data: [
              {
                id: 'APT001',
                patient_name: 'Sarah Johnson',
                time: '09:30 AM',
                type: 'Follow-up',
                status: 'scheduled'
              },
              {
                id: 'APT002',
                patient_name: 'Michael Chen',
                time: '10:15 AM',
                type: 'Consultation',
                status: 'scheduled'
              },
              {
                id: 'APT003',
                patient_name: 'Emma Williams',
                time: '11:00 AM',
                type: 'Check-up',
                status: 'completed'
              },
              {
                id: 'APT004',
                patient_name: 'David Brown',
                time: '02:30 PM',
                type: 'Emergency',
                status: 'scheduled'
              }
            ] as RecentAppointment[]
          })
        ]);
        
        setStats(statsResponse.data);
        setRecentAppointments(appointmentsResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: 'My Patients',
      value: stats.total_patients,
      description: 'Total assigned patients',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: "Today's Appointments",
      value: stats.todays_appointments,
      description: 'Scheduled for today',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Pending Appointments',
      value: stats.pending_appointments,
      description: 'Awaiting confirmation',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Consultations',
      value: stats.completed_consultations,
      description: 'Completed this month',
      icon: Stethoscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-16"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, Dr. Smith
              </h1>
              <p className="text-gray-600">
                Today is {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}. You have {stats.todays_appointments} appointments scheduled.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`border ${stat.borderColor} hover:shadow-lg transition-all duration-200`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-3 rounded-lg border ${stat.borderColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="border-gray-200 h-full">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Today's Schedule</CardTitle>
                  <CardDescription className="text-gray-600">Your upcoming appointments</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentAppointments.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {appointment.patient_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{appointment.patient_name}</p>
                              <p className="text-sm text-gray-600">{appointment.type}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                          <Badge className={`mt-1 ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Takes 1 column */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {[
                { icon: Calendar, label: 'View schedule', color: 'text-blue-600 bg-blue-50 border-blue-200', href: '/doctor/appointments' },
                { icon: Users, label: 'Patient records', color: 'text-green-600 bg-green-50 border-green-200', href: '/doctor/patients' },
                { icon: Clock, label: 'Set availability', color: 'text-purple-600 bg-purple-50 border-purple-200', href: '/doctor/availability' },
                { icon: FileText, label: 'Prescriptions', color: 'text-orange-600 bg-orange-50 border-orange-200', href: '/doctor/prescriptions' }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-gray-50"
                  >
                    <div className={`p-2 rounded-md border ${action.color} mr-3`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {action.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Patient Summary */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">Patient Summary</CardTitle>
            </div>
            <CardDescription className="text-gray-600">This week's overview</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[
                { label: 'New patients', value: 12, color: 'text-blue-600', icon: Users },
                { label: 'Follow-ups', value: 24, color: 'text-green-600', icon: Calendar },
                { label: 'Emergency cases', value: 3, color: 'text-red-600', icon: AlertCircle }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Availability Status */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">Availability</CardTitle>
            </div>
            <CardDescription className="text-gray-600">Current status</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[
                { label: 'Today', status: 'Available', available: true },
                { label: 'Tomorrow', status: 'Available', available: true },
                { label: 'This weekend', status: 'Unavailable', available: false }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${item.available ? 'text-green-700' : 'text-red-700'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
            </div>
            <CardDescription className="text-gray-600">Latest updates</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[
                { activity: 'Patient consultation completed', time: '2 hrs ago', type: 'success' },
                { activity: 'Prescription issued to M. Chen', time: '4 hrs ago', type: 'info' },
                { activity: 'Schedule updated for tomorrow', time: '1 day ago', type: 'update' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.type === 'success' ? 'bg-green-500' : 
                    item.type === 'info' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{item.activity}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}