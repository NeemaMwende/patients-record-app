"use client"

import { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, Activity, Stethoscope, Calendar, TrendingUp, Building2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { doctorApi } from '@/lib/api/doctors';
import { DoctorStats } from '@/lib/types/doctor';

export function DoctorDashboard() {
  const [stats, setStats] = useState<DoctorStats>({
    total_doctors: 0,
    active_doctors: 0,
    on_leave_doctors: 0,
    total_patients_assigned: 0,
    departments: [],
    specializations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await doctorApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch doctor stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Doctors',
      value: stats.total_doctors,
      description: 'All registered doctors',
      icon: Stethoscope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Doctors',
      value: stats.active_doctors,
      description: 'Currently available doctors',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'On Leave',
      value: stats.on_leave_doctors,
      description: 'Doctors currently on leave',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Patients',
      value: stats.total_patients_assigned,
      description: 'Patients under care',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of medical staff and department statistics
        </p>
      </div>
      
      {/* Stats Cards */}
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

      {/* Departments and Specializations */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Departments</span>
            </CardTitle>
            <CardDescription>Doctor distribution by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{dept.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{dept.count}</Badge>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${(dept.count / Math.max(...stats.departments.map(d => d.count))) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Specializations</span>
            </CardTitle>
            <CardDescription>Most common specializations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.specializations.map((spec, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{spec.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{spec.count}</Badge>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{width: `${(spec.count / Math.max(...stats.specializations.map(s => s.count))) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Register new doctor</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm">Manage schedules</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm">View all doctors</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Activity className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Department analytics</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Dr. Smith updated schedule</span>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">New doctor registered</span>
                </div>
                <span className="text-xs text-muted-foreground">5h ago</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Department assignment updated</span>
                </div>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium">Doctor Database</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium">Scheduling System</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium">Patient Records</p>
                <p className="text-xs text-muted-foreground">Synchronized</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}