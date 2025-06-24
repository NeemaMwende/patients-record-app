"use client";

import { useState } from "react";
import { DoctorLayout } from "../../components/layouts/DoctorLayout";
import { DoctorDashboard } from "../../components/admin/admin-dashboard";
import { DoctorList } from "../../components/admin/doctor-list";
import { DoctorForm } from "../../components/admin/doctor-form";
import { Schedules } from "@/components/admin/doctor-schedule";
import DoctorPatients from "../../components/admin/doctor-patients";
import RegisteredPatientsPage from "../../components/admin/registered-patients";

export default function DoctorsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DoctorLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <DoctorDashboard />}
      {activeTab === "list" && <DoctorList />}
      {activeTab === "form" && <DoctorForm />}
      {activeTab === "schedules" && <Schedules />}
      {activeTab === "patients" && <DoctorPatients />}
      {activeTab === "patients" && <RegisteredPatientsPage />}
      
    </DoctorLayout>
  );
}
