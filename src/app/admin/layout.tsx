'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SimpleSidebar from '@/components/admin/SimpleSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check on login and forgot password pages
    if (pathname === '/admin/login' || pathname === '/admin/forgot-password') {
      setIsLoading(false);
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Login and forgot password pages - render without sidebar
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password') {
    return <>{children}</>;
  }

  // Admin pages with sidebar
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SimpleSidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
