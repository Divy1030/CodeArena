"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface ContestLayoutProps {
  children: React.ReactNode;
}

export default function ContestLayout({ children }: ContestLayoutProps) {
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Get user data from localStorage
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
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <Navbar 
        isAuthenticated={!!userData} 
        isAdmin={userData?.role === 'admin'}
        userProfilePicture={userData?.profilePicture || userData?.profile?.avatarUrl}
        username={userData?.username}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}