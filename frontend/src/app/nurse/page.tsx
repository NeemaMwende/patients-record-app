"use client"

import { useState } from 'react';
import { NurseLayout } from '@/app/layouts/NurseLayout';
import { NurseDashboard } from '@/components/nurse/nurse-dashboard';
import { PatientForm } from '@/components/nurse/patient-form';
import { PatientList } from '@/components/nurse/patient-list';
import  Profile  from '@/components/nurse/profile';
import { Toaster } from '@/components/ui/sonner';

export default function NursePage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NurseDashboard onTabChange={setActiveTab} />;
      case 'register':
        return (
          <div className="space-y-4">
            <PatientForm onSuccess={() => setActiveTab('patients')} />
          </div>
        );
      case 'patients':
        return <PatientList />;
      case 'profile':
        return <Profile />;
      default:
        return <NurseDashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <>
      <NurseLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </NurseLayout>
      <Toaster />
    </>
  );
}