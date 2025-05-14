"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Navbar2 from '@/components/contest/Manage/Navbar'
import Footer from '@/components/common/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
      const params = useParams();
      const contestId = params?.contestId as string;
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
      <div className="h-auto bg-[#1e293b]">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4 text-white">Manage Contest</h1>
        <Navbar2 />
        {/* Add additional components or sections here */}
      </div>
    </div>
        {children}
      </main>
      
      <Footer />
    </div>
  );
}