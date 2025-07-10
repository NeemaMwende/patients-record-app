"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { HeartPulse, Stethoscope, UserPlus, Syringe, Hospital } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="w-full bg-purple-100 py-16 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">Welcome to MedSystem</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
            An all-in-one hospital management system powered by Next.js and Django. Simplifying patient care, record management, and staff coordination.
          </p>
          <Button asChild className="bg-purple-700 hover:bg-purple-800 text-white text-lg px-6 py-3 rounded-xl">
            <Link href="/homepage">
              <UserPlus className="mr-2 h-5 w-5" /> Join Us
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-purple-800">What is MedSystem?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-600">
            MedSystem is a modern digital healthcare platform designed to optimize hospital operations. Built with powerful technologies — Django for the backend and Next.js for the frontend — it offers a seamless experience for administrators, doctors, nurses, and patients.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <HeartPulse className="text-purple-600 h-8 w-8" />
              <CardTitle>Patient Care</CardTitle>
            </CardHeader>
            <CardContent>
              
              Our platform helps healthcare workers track, treat, and follow up with patients efficiently.
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <Stethoscope className="text-purple-600 h-8 w-8" />
              <CardTitle>Doctor Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              
              Doctors have access to appointment schedules, patient histories, and prescription tools — all in one place.
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <Hospital className="text-purple-600 h-8 w-8" />
              <CardTitle>Admin Management</CardTitle>
            </CardHeader>
            <CardContent>
              
              Hospital administrators can manage departments, staff, and resources effortlessly.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-purple-800">Services We Offer</h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-600">
            MedSystem brings together a comprehensive suite of healthcare services to ensure smooth hospital operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <Syringe className="text-purple-600 h-8 w-8" />
              <CardTitle>Vaccination Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              
              Monitor and manage patient vaccination records with real-time updates.
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <Stethoscope className="text-purple-600 h-8 w-8" />
              <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              
              Secure and accessible electronic medical records for patients and physicians.
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <HeartPulse className="text-purple-600 h-8 w-8" />
              <CardTitle>Appointments & Billing</CardTitle>
            </CardHeader>
            <CardContent>
              
              Schedule patient appointments and handle billing transactions with ease.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 text-gray-500">
        &copy; {new Date().getFullYear()} MedSystem. All rights reserved.
      </footer>
    </main>
  )
}
