"use client"

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Menu, 
  X,
  Heart,
  FileText
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  {
    name: 'Dashboard',
    id: 'dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics'
  },
  {
    name: 'Register Patient',
    id: 'register',
    icon: UserPlus,
    description: 'Add new patient record'
  },
  {
    name: 'Patient Records',
    id: 'patients',
    icon: Users,
    description: 'View and manage patients'
  },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Full height, fixed position */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">MedRecord</h1>
                <p className="text-xs text-gray-500">Patient Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation - Flexible content area */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )} />
                  <div className="text-left">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer - Fixed at bottom */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <Card className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Need Help?</p>
                  <p className="text-xs text-blue-700">Check our documentation</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => item.id === activeTab)?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {navigation.find(item => item.id === activeTab)?.description || 'Overview and statistics'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}