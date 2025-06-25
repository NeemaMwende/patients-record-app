// components/patient/Profile.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CalendarDays, User, Phone, Mail } from "lucide-react";

export default function Profile() {
  return (
    <Card className="max-w-3xl mx-auto mt-10 shadow-xl">
      <CardHeader className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500">
          <Image
            src="/avatars/patient.png"
            alt="Patient Avatar"
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Jane Doe
          </CardTitle>
          <div className="text-sm text-gray-500">Patient ID: #P10234</div>
          <Badge variant="outline" className="mt-2 text-blue-600 border-blue-600">
            Active Member
          </Badge>
        </div>
      </CardHeader>
      <Separator className="my-2" />
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          Age: 34
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-600" />
          Email: jane.doe@example.com
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-600" />
          Phone: +254 712 345 678
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          Member since: Jan 2022
        </div>
      </CardContent>
    </Card>
  );
}
