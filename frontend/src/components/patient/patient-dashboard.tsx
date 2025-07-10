import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  User, 
  Heart, 
  FileText, 
  Pill,
  Activity,
  Bell,
  Phone,
  Video,
  MapPin,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Download,
  MessageSquare,
  Stethoscope,
  Shield,
  Plus,
  Eye,
  ChevronRight,
  Thermometer,
  Weight,
  Zap
} from 'lucide-react';

const PatientDashboard = () => {
  const [patientData] = useState({
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/60/60',
    memberSince: '2020',
    nextAppointment: {
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialty: 'Cardiologist',
      date: '2024-07-15',
      time: '10:30 AM',
      type: 'In-Person',
      location: 'Cardiology Wing, Room 205'
    },
    recentVitals: {
      bloodPressure: { value: '120/80', status: 'normal', date: '2024-06-20' },
      heartRate: { value: '72 bpm', status: 'normal', date: '2024-06-20' },
      weight: { value: '145 lbs', status: 'stable', date: '2024-06-15' },
      temperature: { value: '98.6°F', status: 'normal', date: '2024-06-20' }
    },
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', nextDose: '8:00 AM', adherence: 95 },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: 'With dinner', adherence: 88 }
    ],
    upcomingAppointments: 3,
    unreadMessages: 2,
    pendingResults: 1,
    healthScore: 85
  });

  const [notifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Rodriguez is tomorrow at 10:30 AM',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'results',
      title: 'Lab Results Available',
      message: 'Your recent blood work results are now available',
      time: '1 day ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Time to take your evening medication',
      time: '3 hours ago',
      priority: 'low'
    }
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVitalStatus = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarImage src={patientData.avatar} alt={patientData.name} />
                <AvatarFallback className="bg-white/20 text-white text-lg">
                  {patientData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {patientData.name.split(' ')[0]}!</h1>
                <p className="text-blue-100">Patient since {patientData.memberSince} • Health Score: {patientData.healthScore}/100</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{patientData.healthScore}</div>
              <div className="text-sm text-blue-100">Health Score</div>
              <Progress value={patientData.healthScore} className="w-24 mt-2 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Next Appointment</p>
                  <p className="text-2xl font-bold text-gray-900">{formatDate(patientData.nextAppointment.date)}</p>
                  <p className="text-blue-600 text-sm">{patientData.nextAppointment.time}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Upcoming Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{patientData.upcomingAppointments}</p>
                  <p className="text-green-600 text-sm">This month</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Unread Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{patientData.unreadMessages}</p>
                  <p className="text-purple-600 text-sm">From providers</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Results</p>
                  <p className="text-2xl font-bold text-gray-900">{patientData.pendingResults}</p>
                  <p className="text-orange-600 text-sm">Lab reports</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Appointment Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center text-blue-700">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Next Appointment
                </CardTitle>
                <CardDescription>Your upcoming medical appointment</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src="/api/placeholder/56/56" alt={patientData.nextAppointment.doctorName} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {patientData.nextAppointment.doctorName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{patientData.nextAppointment.doctorName}</h3>
                    <p className="text-blue-600">{patientData.nextAppointment.doctorSpecialty}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">{formatDate(patientData.nextAppointment.date)}</p>
                      <p className="text-sm text-gray-500">{patientData.nextAppointment.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">{patientData.nextAppointment.type}</p>
                      <p className="text-sm text-gray-500">{patientData.nextAppointment.location}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Video className="w-4 h-4 mr-2" />
                    Join Video Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Vitals */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Vitals
                </CardTitle>
                <CardDescription>Your latest health measurements</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{patientData.recentVitals.bloodPressure.value}</div>
                    <div className="text-sm text-gray-600">Blood Pressure</div>
                    <Badge className={`mt-1 text-xs ${getVitalStatus(patientData.recentVitals.bloodPressure.status)}`}>
                      {patientData.recentVitals.bloodPressure.status}
                    </Badge>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{patientData.recentVitals.heartRate.value}</div>
                    <div className="text-sm text-gray-600">Heart Rate</div>
                    <Badge className={`mt-1 text-xs ${getVitalStatus(patientData.recentVitals.heartRate.status)}`}>
                      {patientData.recentVitals.heartRate.status}
                    </Badge>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                    <Weight className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{patientData.recentVitals.weight.value}</div>
                    <div className="text-sm text-gray-600">Weight</div>
                    <Badge className={`mt-1 text-xs ${getVitalStatus(patientData.recentVitals.weight.status)}`}>
                      {patientData.recentVitals.weight.status}
                    </Badge>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-100">
                    <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{patientData.recentVitals.temperature.value}</div>
                    <div className="text-sm text-gray-600">Temperature</div>
                    <Badge className={`mt-1 text-xs ${getVitalStatus(patientData.recentVitals.temperature.status)}`}>
                      {patientData.recentVitals.temperature.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border-l-4 ${getPriorityColor(notification.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="w-5 h-5 mr-2" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {patientData.medications.map((med, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{med.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {med.adherence}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                      <p className="text-xs text-blue-600 mt-1">Next: {med.nextDose}</p>
                      <Progress value={med.adherence} className="mt-2 h-1" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Manage Medications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and services</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50">
                <Plus className="w-8 h-8 text-blue-600" />
                <span className="text-sm">Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-green-50">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <span className="text-sm">Message Doctor</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-purple-50">
                <Eye className="w-8 h-8 text-purple-600" />
                <span className="text-sm">View Results</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-orange-50">
                <Download className="w-8 h-8 text-orange-600" />
                <span className="text-sm">Download Records</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-red-50">
                <Shield className="w-8 h-8 text-red-600" />
                <span className="text-sm">Insurance</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50">
                <Phone className="w-8 h-8 text-gray-600" />
                <span className="text-sm">Contact Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;