"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage or session
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        setUserData(parsed);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Custom Navbar with logged-in state */}
      <Navbar 
        isAuthenticated={!!userData} 
        isAdmin={userData?.role === 'admin'}
        userProfilePicture={userData?.profilePicture || userData?.profile?.avatarUrl}
        username={userData?.username}
      />
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}