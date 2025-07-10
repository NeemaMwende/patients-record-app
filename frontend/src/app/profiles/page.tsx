// app/select-profile/page.tsx or pages/select-profile.tsx
"use client"

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const roles = [
  { name: "Patient", img: "/avatars/patient.png", value: "patient" },
  { name: "Doctor", img: "/avatars/doctor.png", value: "doctor" },
  { name: "Nurse", img: "/avatars/nurse.png", value: "nurse" },
  { name: "Admin", img: "/avatars/admin.png", value: "admin" },
];

export default function SelectProfilePage() {
  const router = useRouter();

  const handleSelect = (role: string) => {
    localStorage.setItem('selectedRole', role); // or pass via URL query param
    router.push('/homepage');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Who are you logging in as?</h1>
      <div className="grid grid-cols-2 gap-8 max-w-md w-full">
        {roles.map(({ name, img, value }) => (
          <Card
            key={value}
            className="flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition rounded-2xl"
            onClick={() => handleSelect(value)}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-md mb-4">
              <Image
                src={img}
                alt={`${name} avatar`}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-lg font-medium text-gray-700">{name}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
