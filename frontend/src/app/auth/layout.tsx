import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - MedSystem Portal',
  description: 'Secure login and registration for medical professionals',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}