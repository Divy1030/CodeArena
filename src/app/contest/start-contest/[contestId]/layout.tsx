"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/common/Navbar';

// Define interface for user data
interface UserData {
  username?: string;
  profilePicture?: string;
  role?: 'user' | 'admin' | string;
  profile?: {
    avatarUrl?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown; // For other potential properties
}

interface ContestLayoutProps {
  children: React.ReactNode;
}

export default function ContestLayout({ children }: ContestLayoutProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  
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