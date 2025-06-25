import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { DoctorDashboard } from '@/components/doctor/doctor-dashboard';

export default function DoctorPage() {
  return (
    <DoctorLayout>
      <DoctorDashboard />
    </DoctorLayout>
  );
}