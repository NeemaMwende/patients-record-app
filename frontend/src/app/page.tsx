"use client"

import { useState } from 'react';
import { NurseLayout } from '@/components/layouts/NurseLayout';
import { NurseDashboard } from '@/components/nurse/nurse-dashboard';
import { PatientForm } from '@/components/nurse/patient-form';
import { PatientList } from '@/components/nurse/patient-list';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NurseDashboard />;
      case 'register':
        return (
          <div className="space-y-4">
            <PatientForm onSuccess={() => setActiveTab('patients')} />
          </div>
        );
      case 'patients':
        return <PatientList />;
      default:
        return <NurseDashboard />;
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