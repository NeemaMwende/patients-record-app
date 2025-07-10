"use client";

import { useState } from "react";
import { DoctorLayout } from "../layouts/DoctorLayout";
import { DashboardContent } from "@/components/doctor/doctor-dashboard";
import { DoctorAvailabilityPage } from "@/components/doctor/DoctorAvailabilityPage";
import { MyPatientsPage } from "@/components/doctor/MyPatientsPage";
import { DoctorAppointmentsPage } from "@/components/doctor/DoctorAppointmentsPage";
import Profile from "@/components/doctor/profile";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent onNavigate={setActiveTab} />;
      case "appointment":
        return <DoctorAppointmentsPage />;
      case "availability":
        return <DoctorAvailabilityPage />;
      case "my-patients":
        return <MyPatientsPage />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardContent onNavigate={setActiveTab} />;
    }
  };

  return (
    <DoctorLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DoctorLayout>
  );
}