"use client"

import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, Activity, Stethoscope, FileText } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { doctorApi } from '@/lib/api';

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
        const [statsResponse, appointmentsResponse] = await Promise.all([
          doctorApi.getStats(),
          doctorApi.getRecentAppointments()
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
    },
    {
      title: "Today's Appointments",
      value: stats.todays_appointments,
      description: 'Scheduled for today',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Appointments',
      value: stats.pending_appointments,
      description: 'Awaiting confirmation',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Consultations',
      value: stats.completed_consultations,
      description: 'Completed this month',
      icon: Stethoscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's your practice overview
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-full`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your upcoming appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAppointments.length > 0 ? (
              <div className="space-y-3">
                {recentAppointments.slice(0, 4).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{appointment.patient_name}</p>
                      <p className="text-xs text-muted-foreground">{appointment.type}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs font-medium">{appointment.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No appointments scheduled for today</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm">View today's schedule</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm">Check patient records</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Set availability</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Write prescription</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Patient Summary</CardTitle>
            <CardDescription>This week's overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>New patients</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Follow-ups</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency cases</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability Status</CardTitle>
            <CardDescription>Current availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Today</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
              <div className="flex justify-between">
                <span>Tomorrow</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
              <div className="flex justify-between">
                <span>This weekend</span>
                <span className="text-red-600 font-medium">Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Patient consultation</span>
                <span className="text-muted-foreground">2 hrs ago</span>
              </div>
              <div className="flex justify-between">
                <span>Prescription issued</span>
                <span className="text-muted-foreground">4 hrs ago</span>
              </div>
              <div className="flex justify-between">
                <span>Schedule updated</span>
                <span className="text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}