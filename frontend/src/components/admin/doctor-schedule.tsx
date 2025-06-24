"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Schedule = {
    doctorId: string;
    doctorName: string;
    day: string;
    startTime: string;
    endTime: string;
  };
  
const mockDoctors = [
  { id: "doc1", name: "Dr. James Kimani" },
  { id: "doc2", name: "Dr. Aisha Mwikali" },
  { id: "doc3", name: "Dr. Samuel Kiptoo" },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function Schedules() {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleAddSchedule = () => {
    if (!selectedDoctor || !day || !startTime || !endTime) return alert("Fill all fields");

    const newSchedule = {
      doctorId: selectedDoctor,
      doctorName: mockDoctors.find((d) => d.id === selectedDoctor)?.name || "",
      day,
      startTime,
      endTime,
    };

    setSchedules((prev) => [...prev, newSchedule]);
    setDay("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Set Doctor Schedule</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Doctor</Label>
            <Select onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                {mockDoctors.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Day</Label>
            <Select onValueChange={setDay} value={day}>
              <SelectTrigger>
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {weekdays.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Start Time</Label>
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>

          <div>
            <Label>End Time</Label>
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <Button className="mt-4" onClick={handleAddSchedule}>Add Schedule</Button>
      </Card>

      {schedules.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Saved Schedules</h2>
          <ul className="space-y-2">
            {schedules.map((s, index) => (
              <li key={index} className="border p-3 rounded-md bg-gray-50">
                <strong>{s.doctorName}</strong> is available on <strong>{s.day}</strong> from <strong>{s.startTime}</strong> to <strong>{s.endTime}</strong>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
