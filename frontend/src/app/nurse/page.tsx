"use client";

import { useState } from "react";
import { NurseDashboard } from "../../components/nurse/nurse-dashboard";
import { PatientList } from "../../components/nurse/patient-list";
import { PatientForm } from "../../components/nurse/patient-form";
// import { Schedules } from "@/components/admin/doctor-schedule";
// import DoctorPatients from "../../components/admin/doctor-patients";
// import RegisteredPatientsPage from "../../components/admin/registered-patients";
import { NurseLayout } from "@/components/layouts/NurseLayout";

export default function DoctorsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <NurseLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <NurseDashboard />}
      {activeTab === "list" && <PatientList />}
      {activeTab === "form" && <PatientForm />}
      {/* {activeTab === "schedules" && <Schedules />}
      {activeTab === "patients" && <DoctorPatients />}
      {activeTab === "patients" && <RegisteredPatientsPage />} */}
      
    </NurseLayout>
  );
}
