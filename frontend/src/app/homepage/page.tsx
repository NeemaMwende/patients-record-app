'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page after a brief moment
    const timer = setTimeout(() => {
      router.push('/auth/login')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-8">
          <Heart className="w-10 h-10 text-white animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            MedSystem Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Secure Medical Records Management System
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to login...
          </p>
        </div>
      </div>
    </div>
  )
}