"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set authentication state
    setIsAuthenticated(true);

    // Check if user is admin
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        // Check for the admin role in the user data
        setIsAdmin(userData.role === 'admin');
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Custom Navbar with logged-in state */}
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}