// "use client";

// import { useState } from "react";
// import { NurseDashboard } from "../../components/nurse/nurse-dashboard";
// import { PatientList } from "../../components/nurse/patient-list";
// import { PatientForm } from "../../components/nurse/patient-form";
// // import { Schedules } from "@/components/admin/doctor-schedule";
// // import DoctorPatients from "../../components/admin/doctor-patients";
// // import RegisteredPatientsPage from "../../components/admin/registered-patients";
// import { NurseLayout } from "@/components/layouts/NurseLayout";

// export default function DoctorsPage() {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   return (
//     <NurseLayout activeTab={activeTab} onTabChange={setActiveTab}>
//       {activeTab === "dashboard" && <NurseDashboard />}
//       {activeTab === "list" && <PatientList />}
//       {activeTab === "form" && <PatientForm />}
//       {/* {activeTab === "schedules" && <Schedules />}
//       {activeTab === "patients" && <DoctorPatients />}
//       {activeTab === "patients" && <RegisteredPatientsPage />} */}
      
//     </NurseLayout>
//   );
// }

"use client"

import { useState } from 'react';
import { NurseLayout } from '@/app/layouts/NurseLayout';
import { NurseDashboard } from '@/components/nurse/nurse-dashboard';
import { PatientForm } from '@/components/nurse/patient-form';
import { PatientList } from '@/components/nurse/patient-list';
import { Toaster } from '@/components/ui/sonner';

export default function NursePage() {
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
