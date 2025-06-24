"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Define doctor & patient types
type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  patients: Patient[];
};

// Example data (replace with API later)
const doctorsData: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. James Kimani",
    specialty: "Cardiologist",
    patients: [
      { id: "p1", name: "Alice Wanjiku", age: 45, condition: "Hypertension" },
      { id: "p2", name: "Brian Otieno", age: 53, condition: "Arrhythmia" },
    ],
  },
  {
    id: "doc2",
    name: "Dr. Amina Mohamed",
    specialty: "Dermatologist",
    patients: [
      { id: "p3", name: "Sarah Njeri", age: 32, condition: "Eczema" },
    ],
  },
];

export default function DoctorPatients() {
  const [openDoctors, setOpenDoctors] = useState<string[]>([]);

  const toggleOpen = (id: string) => {
    setOpenDoctors((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {doctorsData.map((doctor) => (
        <Card key={doctor.id} className="p-4 shadow-sm border">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleOpen(doctor.id)}
          >
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                {doctor.name}
              </h2>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
            </div>
            {openDoctors.includes(doctor.id) ? (
              <ChevronDown className="text-blue-500" />
            ) : (
              <ChevronRight className="text-gray-400" />
            )}
          </div>

          {openDoctors.includes(doctor.id) && (
            <div className="mt-4 space-y-3">
              {doctor.patients.length > 0 ? (
                doctor.patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center space-x-3 bg-blue-50 p-3 rounded-md"
                  >
                    <User className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">{patient.name}</p>
                      <p className="text-sm text-gray-500">
                        Age: {patient.age} — {patient.condition}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No assigned patients.</p>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
