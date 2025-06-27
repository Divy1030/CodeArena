"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
// import Footer from '@/components/common/Footer';
import Link from 'next/link';
import ManageContestNavbar from '@/components/contest/Manage/ManageContestNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const params = useParams();
  const contestId = params?.contestId as string;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contestTitle, setContestTitle] = useState('');
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
    
    // Check user permissions
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      router.push('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userDataString);
      const userId = userData._id || userData.id;
      const userRole = userData.role;
      
      console.log('User data:', userData);
      console.log('User ID:', userId);
      console.log('User role:', userRole);
      
      // Set admin status for UI purposes
      const isUserAdmin = userRole === 'admin';
      setIsAdmin(isUserAdmin);
      
      // Fetch contest details to check permissions
      const fetchContestDetails = async () => {
        try {
          const response = await fetch(`/api/contest/getContestById/${contestId}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            setContestTitle(result.data.title);
            
            // ⚠️ Fix comparison for string IDs vs ObjectIds
            const isOrganizer = result.data.organizer === userId || 
                               result.data.organizer._id === userId;
            
            // Check if userId is in moderators array using string comparison
            // Defining type for a moderator which could be a string ID or an object with _id
            interface ModeratorObject {
              _id: string;
              [key: string]: unknown; // Allow other properties
            }
            
            const isModerator: boolean = Array.isArray(result.data.moderators) && 
                       result.data.moderators.some((mod: string | ModeratorObject) => 
                       mod === userId || 
                       (mod as ModeratorObject)?._id === userId || 
                       (typeof mod === 'object' && (mod as ModeratorObject)._id === userId)
                       );
            
            const hasAccess = isUserAdmin || isOrganizer || isModerator;
            
            console.log('Is admin:', isUserAdmin);
            console.log('Is organizer:', isOrganizer, 'Organizer:', result.data.organizer);
            console.log('User ID for comparison:', userId);
            console.log('Moderators array:', result.data.moderators);
            console.log('Is moderator for this contest:', isModerator);
            console.log('Has access:', hasAccess);
            
            if (!hasAccess) {
              console.log('Unauthorized: User does not have permission to manage this contest');
              router.push('/unauthorized');
            }
          } else {
            console.error('Failed to fetch contest details:', result.message || 'Unknown error');
            router.push('/not-found');
          }
        } catch (error) {
          console.error('Error fetching contest details:', error);
          router.push('/error');
        }
      };
      
      fetchContestDetails();
    } catch (error) {
      console.error('Error processing user data:', error);
      router.push('/login');
    }
  }, [router, contestId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white">
      {/* Main navbar */}
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />

      {/* Contest management header */}
      <div className="bg-[#121B38] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center text-sm">
            <Link href="/admin/home" className="text-blue-400 hover:text-blue-300 hover:underline">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-500">›</span>
            <span className="text-gray-400 font-medium">{contestTitle}</span>
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl md:text-3xl font-medium text-white">{contestTitle}</h1>
            <div className="text-blue-400 text-sm mt-1">
              {`https://codeup.com/contest/${contestId}`}
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation - now using the dedicated component */}
      <ManageContestNavbar />

      {/* Main content */}
      <main className="flex-1 bg-[#0f172a]">
        {children}
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}