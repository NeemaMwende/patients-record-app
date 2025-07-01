"use client"

import { useState } from 'react';
import { PatientLayout } from '@/app/layouts/PatientLayout';
import  PatientDashboard  from '@/components/patient/patient-dashboard';
import  Appointments  from '@/components/patient/appointments';
import  Profile  from '@/components/patient/profile';
import { Toaster } from '@/components/ui/sonner';

export default function PatientPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PatientDashboard />;
      case 'appointments':
        return (
          <div className="space-y-4">
            <Appointments onSuccess={() => setActiveTab('appointments')} />
          </div>
        );
      case 'profile':
        return <Profile />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <>
      <PatientLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </PatientLayout>
      <Toaster />
    </>
  );
}