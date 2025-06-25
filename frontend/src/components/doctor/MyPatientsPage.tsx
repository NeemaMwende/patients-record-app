"use client"

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Phone, Mail, Calendar } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  last_visit: string;
  condition: string;
  status: 'stable' | 'critical' | 'improving' | 'monitoring';
  blood_type: string;
  next_appointment?: string;
}

export function MyPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPatients: Patient[] = [
          {
            id: '1',
            name: 'John Doe',
            age: 45,
            gender: 'Male',
            phone: '+1234567890',
            email: 'john.doe@email.com',
            last_visit: '2024-01-15',
            condition: 'Hypertension',
            status: 'stable',
            blood_type: 'O+',
            next_appointment: '2024-02-15'
          },
          {
            id: '2',
            name: 'Jane Smith',
            age: 32,
            gender: 'Female',
            phone: '+1234567891',
            email: 'jane.smith@email.com',
            last_visit: '2024-01-20',
            condition: 'Diabetes Type 2',
            status: 'monitoring',
            blood_type: 'A+',
          },
          {
            id: '3',
            name: 'Mike Johnson',
            age: 28,
            gender: 'Male',
            phone: '+1234567892',
            email: 'mike.johnson@email.com',
            last_visit: '2024-01-22',
            condition: 'Asthma',
            status: 'improving',
            blood_type: 'B-',
            next_appointment: '2024-02-10'
          },
        ];
        
        setPatients(mockPatients);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'improving':
        return 'bg-blue-100 text-blue-800';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
        <h2 className="text-3xl font-bold tracking-tight">My Patients</h2>
        <p className="text-muted-foreground">
          Manage and view your assigned patients
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'stable' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('stable')}
          >
            Stable
          </Button>
          <Button
            variant={filterStatus === 'monitoring' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('monitoring')}
          >
            Monitoring
          </Button>
          <Button
            variant={filterStatus === 'critical' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('critical')}
          >
            Critical
          </Button>
        </div>
      </div>

      {/* Patients List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{patient.name}</h3>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Age:</span> {patient.age}
                    </div>
                    <div>
                      <span className="font-medium">Gender:</span> {patient.gender}
                    </div>
                    <div>
                      <span className="font-medium">Blood Type:</span> {patient.blood_type}
                    </div>
                    <div>
                      <span className="font-medium">Last Visit:</span> {patient.last_visit}
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Condition:</span> {patient.condition}
                  </div>

                  {patient.next_appointment && (
                    <div className="text-sm text-blue-600">
                      <span className="font-medium">Next Appointment:</span> {patient.next_appointment}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No patients found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}