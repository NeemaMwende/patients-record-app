"use client";

import { useEffect, useState } from "react";
import { differenceInYears } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { patientApi, Patient } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function RegisteredPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientApi.getPatients();
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const calculateAge = (dob: string | Date | null): number | null => {
    if (!dob) return null;
    try {
      return differenceInYears(new Date(), new Date(dob));
    } catch {
      return null;
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || (patient.status ?? "active").toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="max-w-6xl mx-auto mt-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Registered Patients</CardTitle>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2"
          />
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
            <SelectTrigger className="w-full md:w-1/3">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filteredPatients.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No patients match your search.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient, index) => (
                <TableRow key={patient.patient_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{patient.first_name} {patient.last_name}</TableCell>
                  <TableCell>{calculateAge(patient.date_of_birth) ?? "N/A"}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell className="capitalize">{patient.status ?? "active"}</TableCell>
                  <TableCell>{patient.phone_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
