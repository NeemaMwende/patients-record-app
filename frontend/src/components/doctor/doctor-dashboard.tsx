"use client";

import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  FileText,
  User,
  Stethoscope,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  onNavigate: (tab: string) => void;
}

export function DashboardContent({ onNavigate }: DashboardContentProps) {
  const statsCards = [
    {
      title: "My Patients",
      value: 87,
      description: "Total assigned patients",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      tab: "my-patients",
    },
    {
      title: "Today's Appointments",
      value: 12,
      description: "Scheduled for today",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      tab: "appointment",
    },
    {
      title: "Pending Appointments",
      value: 8,
      description: "Awaiting confirmation",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      tab: "availability",
    },
    {
      title: "Consultations",
      value: 145,
      description: "Completed this month",
      icon: Stethoscope,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      tab: "appointment", // or another tab if appropriate
    },
  ];

  const quickActions = [
    { icon: Calendar, label: "View full schedule", tab: "appointment", color: "text-blue-600 bg-blue-50 border-blue-200" },
    { icon: Users, label: "Patient records", tab: "my-patients", color: "text-green-600 bg-green-50 border-green-200" },
    { icon: Clock, label: "Set availability", tab: "availability", color: "text-purple-600 bg-purple-50 border-purple-200" },
    { icon: FileText, label: "Manage prescriptions", tab: "appointment", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { icon: User, label: "Update profile", tab: "profile", color: "text-orange-600 bg-orange-50 border-orange-200" },
    // { icon: LayoutDashboard, label: "Settings", tab: "settings", color: "text-gray-600 bg-gray-50 border-gray-200" },
  ];

  const appointments = [
    { id: "APT001", patientName: "Sarah Johnson", time: "09:30 AM", type: "Follow-up", status: "scheduled" },
    { id: "APT002", patientName: "Michael Chen", time: "10:15 AM", type: "Consultation", status: "scheduled" },
    { id: "APT003", patientName: "Emma Williams", time: "11:00 AM", type: "Check-up", status: "completed" },
    { id: "APT004", patientName: "David Brown", time: "02:30 PM", type: "Emergency", status: "scheduled" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Dr. Smith</h1>
              <p className="text-gray-600">
                Today is{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                . You have 12 appointments scheduled.
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
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              onClick={() => onNavigate(card.tab)}
              className={cn("cursor-pointer transition-all hover:shadow-lg border", card.borderColor)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-3 rounded-lg border ${card.borderColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
                <p className="text-sm text-gray-600">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
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
                <Button variant="outline" size="sm" onClick={() => onNavigate("appointment")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {appt.patientName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{appt.patientName}</p>
                          <p className="text-sm text-gray-600">{appt.type}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-900">{appt.time}</p>
                        <Badge className={cn("mt-1", getStatusColor(appt.status))}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
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
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-gray-50"
                    onClick={() => onNavigate(action.tab)}
                  >
                    <div className={`p-2 rounded-md border ${action.color} mr-3`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
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
