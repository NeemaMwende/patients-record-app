"use client"

import { useState } from 'react';
import { Clock, Plus, Edit, Trash2, Save, X } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface DaySchedule {
  day: string;
  is_active: boolean;
  time_slots: TimeSlot[];
}

export function DoctorAvailabilityPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: 'Monday',
      is_active: true,
      time_slots: [
        { id: '1', start_time: '09:00', end_time: '12:00', is_available: true },
        { id: '2', start_time: '14:00', end_time: '17:00', is_available: true },
      ]
    },
    {
      day: 'Tuesday',
      is_active: true,
      time_slots: [
        { id: '3', start_time: '09:00', end_time: '12:00', is_available: true },
        { id: '4', start_time: '14:00', end_time: '17:00', is_available: true },
      ]
    },
    {
      day: 'Wednesday',
      is_active: true,
      time_slots: [
        { id: '5', start_time: '09:00', end_time: '12:00', is_available: true },
      ]
    },
    {
      day: 'Thursday',
      is_active: true,
      time_slots: [
        { id: '6', start_time: '09:00', end_time: '12:00', is_available: true },
        { id: '7', start_time: '14:00', end_time: '17:00', is_available: true },
      ]
    },
    {
      day: 'Friday',
      is_active: true,
      time_slots: [
        { id: '8', start_time: '09:00', end_time: '12:00', is_available: true },
      ]
    },
    {
      day: 'Saturday',
      is_active: false,
      time_slots: []
    },
    {
      day: 'Sunday',
      is_active: false,
      time_slots: []
    },
  ]);

  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState<{ day: string; start_time: string; end_time: string } | null>(null);

  const toggleDayActive = (dayIndex: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].is_active = !updatedSchedule[dayIndex].is_active;
    if (!updatedSchedule[dayIndex].is_active) {
      updatedSchedule[dayIndex].time_slots = [];
    }
    setSchedule(updatedSchedule);
  };

  const toggleSlotAvailability = (dayIndex: number, slotId: string) => {
    const updatedSchedule = [...schedule];
    const slot = updatedSchedule[dayIndex].time_slots.find(s => s.id === slotId);
    if (slot) {
      slot.is_available = !slot.is_available;
      setSchedule(updatedSchedule);
    }
  };

  const addTimeSlot = (dayIndex: number) => {
    setNewSlot({ day: schedule[dayIndex].day, start_time: '', end_time: '' });
  };

  const saveNewSlot = (dayIndex: number) => {
    if (newSlot && newSlot.start_time && newSlot.end_time) {
      const updatedSchedule = [...schedule];
      const newSlotData: TimeSlot = {
        id: Date.now().toString(),
        start_time: newSlot.start_time,
        end_time: newSlot.end_time,
        is_available: true
      };
      updatedSchedule[dayIndex].time_slots.push(newSlotData);
      setSchedule(updatedSchedule);
      setNewSlot(null);
    }
  };

  const deleteTimeSlot = (dayIndex: number, slotId: string) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].time_slots = updatedSchedule[dayIndex].time_slots.filter(s => s.id !== slotId);
    setSchedule(updatedSchedule);
  };

  const saveSchedule = async () => {
    try {
      // Simulate API call
      console.log('Saving schedule:', schedule);
      // await doctorApi.updateAvailability(schedule);
      alert('Schedule saved successfully!');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      alert('Failed to save schedule. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Availability Settings</h2>
          <p className="text-muted-foreground">
            Set your available hours for patient appointments
          </p>
        </div>
        <Button onClick={saveSchedule} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Schedule
        </Button>
      </div>

      <div className="grid gap-6">
        {schedule.map((daySchedule, dayIndex) => (
          <Card key={daySchedule.day}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{daySchedule.day}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`${daySchedule.day}-active`}>Active</Label>
                  <Switch
                    id={`${daySchedule.day}-active`}
                    checked={daySchedule.is_active}
                    onCheckedChange={() => toggleDayActive(dayIndex)}
                  />
                </div>
              </div>
            </CardHeader>
            
            {daySchedule.is_active && (
              <CardContent className="space-y-4">
                {/* Existing Time Slots */}
                {daySchedule.time_slots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {slot.start_time} - {slot.end_time}
                      </span>
                      <Badge variant={slot.is_available ? "default" : "secondary"}>
                        {slot.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSlotAvailability(dayIndex, slot.id)}
                      >
                        {slot.is_available ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTimeSlot(dayIndex, slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add New Slot Form */}
                {newSlot && newSlot.day === daySchedule.day ? (
                  <div className="flex items-center space-x-4 p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="start-time">From:</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newSlot.start_time}
                        onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="end-time">To:</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newSlot.end_time}
                        onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                        className="w-32"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => saveNewSlot(dayIndex)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setNewSlot(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => addTimeSlot(dayIndex)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Apply common scheduling patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                // Apply standard weekday schedule
                const standardSchedule = schedule.map(day => {
                  if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day.day)) {
                    return {
                      ...day,
                      is_active: true,
                      time_slots: [
                        { id: Date.now().toString() + day.day + '1', start_time: '09:00', end_time: '12:00', is_available: true },
                        { id: Date.now().toString() + day.day + '2', start_time: '14:00', end_time: '17:00', is_available: true },
                      ]
                    };
                  }
                  return { ...day, is_active: false, time_slots: [] };
                });
                setSchedule(standardSchedule);
              }}
            >
              Standard Weekdays
            </Button>
            
            <Button
              variant="outline" 
              onClick={() => {
                // Apply morning only schedule
                const morningSchedule = schedule.map(day => {
                  if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day.day)) {
                    return {
                      ...day,
                      is_active: true,
                      time_slots: [
                        { id: Date.now().toString() + day.day, start_time: '09:00', end_time: '12:00', is_available: true },
                      ]
                    };
                  }
                  return { ...day, is_active: false, time_slots: [] };
                });
                setSchedule(morningSchedule);
              }}
            >
              Morning Only
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Clear all schedules
                const clearedSchedule = schedule.map(day => ({
                  ...day,
                  is_active: false,
                  time_slots: []
                }));
                setSchedule(clearedSchedule);
              }}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}