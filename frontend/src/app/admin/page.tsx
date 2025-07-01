"use client";

import { useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import { AdminDashboard } from "../../components/admin/admin-dashboard";
import { DoctorList } from "../../components/admin/doctor-list";
import { DoctorForm } from "../../components/admin/doctor-form";
import { Schedules } from "@/components/admin/doctor-schedule";
import DoctorPatients from "../../components/admin/doctor-patients";
import RegisteredPatientsPage from "../../components/admin/registered-patients";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard onNavigate={setActiveTab} />;
      case "doctors":
        return <DoctorList />;
      case "register-doctor":
        return <DoctorForm />;
      case "schedules":
        return <Schedules />;
      case "doctor-patients":
        return <DoctorPatients />;
      case "patients":
        return <RegisteredPatientsPage />;
      default:
        return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
}