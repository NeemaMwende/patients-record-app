"use client"

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  User, 
  Menu, 
  X,
  Stethoscope,
  Bell,
  Heart,
  Activity,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  Eye,
  Search,
  Filter,
  Plus,
  Save,
  Edit
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Navigation items
const navigation = [
  {
    name: 'Dashboard',
    id: 'dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics'
  },
  {
    name: 'My Patients',
    id: 'patients',
    icon: Users,
    description: 'Manage assigned patients'
  },
  {
    name: 'Schedule',
    id: 'schedule',
    icon: Calendar,
    description: 'Set availability & appointments'
  },
  {
    name: 'Profile',
    id: 'profile',
    icon: User,
    description: 'Manage your profile'
  },
];

// Mock data
const mockStats = {
  totalPatients: 87,
  todaysAppointments: 12,
  pendingAppointments: 8,
  completedConsultations: 145,
};

const mockPatients = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    phone: '+254-712-345-678',
    email: 'john.doe@email.com',
    lastVisit: '2024-01-15',
    condition: 'Hypertension',
    status: 'stable',
    bloodType: 'O+',
    nextAppointment: '2024-02-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    phone: '+254-723-456-789',
    email: 'jane.smith@email.com',
    lastVisit: '2024-01-20',
    condition: 'Diabetes Type 2',
    status: 'monitoring',
    bloodType: 'A+',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    age: 28,
    gender: 'Male',
    phone: '+254-734-567-890',
    email: 'mike.johnson@email.com',
    lastVisit: '2024-01-22',
    condition: 'Asthma',
    status: 'improving',
    bloodType: 'B-',
    nextAppointment: '2024-02-10'
  },
];

const mockAppointments = [
  {
    id: 'APT001',
    patientName: 'Sarah Johnson',
    time: '09:30 AM',
    type: 'Follow-up',
    status: 'scheduled'
  },
  {
    id: 'APT002',
    patientName: 'Michael Chen',
    time: '10:15 AM',
    type: 'Consultation',
    status: 'scheduled'
  },
  {
    id: 'APT003',
    patientName: 'Emma Williams',
    time: '11:00 AM',
    type: 'Check-up',
    status: 'completed'
  },
  {
    id: 'APT004',
    patientName: 'David Brown',
    time: '02:30 PM',
    type: 'Emergency',
    status: 'scheduled'
  }
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Dashboard Component
export function DashboardContent() {
  const statsCards = [
    {
      title: 'My Patients',
      value: mockStats.totalPatients,
      description: 'Total assigned patients',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: "Today's Appointments",
      value: mockStats.todaysAppointments,
      description: 'Scheduled for today',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Pending Appointments',
      value: mockStats.pendingAppointments,
      description: 'Awaiting confirmation',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Consultations',
      value: mockStats.completedConsultations,
      description: 'Completed this month',
      icon: Stethoscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

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
                })}. You have {mockStats.todaysAppointments} appointments scheduled.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>System Online</span>
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
        {/* Today's Schedule */}
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
              <div className="divide-y divide-gray-100">
                {mockAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
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
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {[
                { icon: Calendar, label: 'View full schedule', color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { icon: Users, label: 'Patient records', color: 'text-green-600 bg-green-50 border-green-200' },
                { icon: Clock, label: 'Set availability', color: 'text-purple-600 bg-purple-50 border-purple-200' },
                { icon: User, label: 'Update profile', color: 'text-orange-600 bg-orange-50 border-orange-200' }
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
    </div>
  );
}
