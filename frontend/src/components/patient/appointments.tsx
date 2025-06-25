// components/patient/CurrentAppointments.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User } from "lucide-react";

const appointments = [
  {
    id: 1,
    doctor: "Dr. Hillary Chege",
    specialization: "Cardiologist",
    date: "2025-06-21",
    time: "10:30 AM",
  },
  {
    id: 2,
    doctor: "Dr. Njeri Kamau",
    specialization: "Dermatologist",
    date: "2025-06-25",
    time: "2:00 PM",
  },
];

export default function Appointments() {
  return (
    <Card className="max-w-4xl mx-auto mt-10 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 mt-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="border p-4 rounded-lg shadow-sm bg-white space-y-2">
            <div className="text-md font-semibold text-blue-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              {appt.doctor} - {appt.specialization}
            </div>
            <div className="flex gap-4 text-gray-700 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {appt.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {appt.time}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="destructive" size="sm">
                Cancel
              </Button>
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
