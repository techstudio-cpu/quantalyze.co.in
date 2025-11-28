'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';

interface AdminLayoutWrapperProps {
  children: ReactNode;
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Check if current path is admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  if (isAdminRoute) {
    // For admin routes, render children without header and footer
    return <>{children}</>;
  }
  
  // For non-admin routes, render with header and footer
  return (
    <>
      <TopBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
