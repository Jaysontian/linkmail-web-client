'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/contexts/SidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)}>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar 
          expanded={sidebarExpanded} 
          onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
        />

        {/* Main Content Container */}
        <div className="flex-1 relative pb-32">
          <main className="overflow-auto h-full">
            {children}
          </main>
          
          <div className="sticky bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none -mb-32 z-10" />
        </div>
      </div>
    </SidebarProvider>
  );
}
