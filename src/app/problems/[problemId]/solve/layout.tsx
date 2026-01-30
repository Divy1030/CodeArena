"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/common/Navbar';

interface SolveLayoutProps {
  children: React.ReactNode;
}

interface UserData {
  role?: string;
  profilePicture?: string;
  username?: string;
  profile?: {
    avatarUrl?: string;
  };
}

export default function SolveLayout({ children }: SolveLayoutProps) {
  const [userData, setUserData] = useState<UserData | null>(null);

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
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Navbar */}
      <Navbar 
        isAuthenticated={!!userData} 
        isAdmin={userData?.role === 'admin'}
        userProfilePicture={userData?.profilePicture || userData?.profile?.avatarUrl}
        username={userData?.username}
      />
      
      {/* Main content - no footer for editor */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
