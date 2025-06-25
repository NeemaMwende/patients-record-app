"use client"

import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { patientApi } from '@/lib/api';

interface DashboardStats {
  total_patients: number;
  male_patients: number;
  female_patients: number;
}

export function PatientDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_patients: 0,
    male_patients: 0,
    female_patients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await patientApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Patients',
      value: stats.total_patients,
      description: 'All registered patients',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Male Patients',
      value: stats.male_patients,
      description: 'Male patient count',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Female Patients',
      value: stats.female_patients,
      description: 'Female patient count',
      icon: UserX,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Active Records',
      value: stats.total_patients,
      description: 'Currently active records',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

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
        <h2 className="text-3xl font-bold tracking-tight">My Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your patient records system
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Register new patient</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Activity className="h-4 w-4 text-green-600" />
              <span>View patient records</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <UserCheck className="h-4 w-4 text-purple-600" />
              <span>Update patient information</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>System initialized</span>
                <span className="text-muted-foreground">Today</span>
              </div>
              <div className="flex justify-between">
                <span>Database connected</span>
                <span className="text-muted-foreground">Today</span>
              </div>
              <div className="flex justify-between">
                <span>Ready for patients</span>
                <span className="text-muted-foreground">Now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}