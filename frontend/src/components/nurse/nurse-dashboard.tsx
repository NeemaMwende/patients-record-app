"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserCheck,
  UserX,
  Activity,
  Clock,
  Calendar,
  Stethoscope,
  LogOut
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { patientApi } from '@/lib/api';

interface DashboardStats {
  total_patients: number;
  male_patients: number;
  female_patients: number;
}

interface NurseDashboardProps {
  onTabChange?: (tab: string) => void;
}

export function NurseDashboard({ onTabChange }: NurseDashboardProps) {
  const router = useRouter();

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

  const quickActions = [
    {
      label: 'Register new patient',
      icon: Stethoscope,
      color: 'text-blue-600',
      tab: 'register',
    },
    {
      label: 'View patient records',
      icon: Calendar,
      color: 'text-green-600',
      tab: 'patients',
    },
    {
      label: 'Update patient information',
      icon: Users,
      color: 'text-purple-600',
      tab: 'patients',
    },
    {
      label: 'View profile',
      icon: Activity,
      color: 'text-orange-600',
      tab: 'profile',
    },
  ];

  const handleQuickAction = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your patient records system</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={() => router.push('/auth/login')}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-full`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleQuickAction(action.tab)}
                >
                  <Icon className={`h-4 w-4 ${action.color}`} />
                  <span className="text-sm">{action.label}</span>
                </div>
              );
            })}
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
                  <span className="text-sm">System initialized</span>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Database connected</span>
                </div>
                <span className="text-xs text-muted-foreground">5h ago</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Ready for patients</span>
                </div>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}