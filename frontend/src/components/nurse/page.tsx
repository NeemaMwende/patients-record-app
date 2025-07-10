"use client"

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { Dashboard } from '@/components/nurse/dashboard';
import { PatientForm } from '@/components/nurse/patient-form';
import { PatientList } from '@/components/nurse/patient-list';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'register':
        return (
          <div className="space-y-4">
            <PatientForm onSuccess={() => setActiveTab('patients')} />
          </div>
        );
      case 'patients':
        return <PatientList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
      <Toaster />
    </>
  );
}