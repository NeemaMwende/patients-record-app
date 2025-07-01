import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { DashboardContent } from '@/components/doctor/doctor-dashboard';

export default function DoctorPage() {
  return (
    <DoctorLayout>
      <DashboardContent />
    </DoctorLayout>
  );
}