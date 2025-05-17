"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const contestId = params?.contestId as string;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userDataString = localStorage.getItem('userData');
        
        if (!token || !userDataString) {
          router.push('/auth/login');
          return;
        }
        
        // Parse user data
        const userData = JSON.parse(userDataString);
        const userId = userData._id || userData.id;
        const isAdmin = userData.role === 'admin';
        
        if (adminOnly) {
          // If this is a contest management page, check if user is organizer or moderator
          if (contestId) {
            try {
              // Fetch contest details to check if user is organizer or moderator
              const response = await fetch(`/api/contest/getContestById/${contestId}`);
              const result = await response.json();
              
              if (result.success && result.data) {
                // Check if user is organizer
                const isOrganizer = result.data.organizer === userId || 
                                  result.data.organizer._id === userId;
                
                // Check if user is moderator
                // Define types for moderator
                type ModeratorId = string;
                interface ModeratorObject {
                  _id: string;
                }
                
                const isModerator: boolean = Array.isArray(result.data.moderators) && 
                          result.data.moderators.some((mod: ModeratorId | ModeratorObject) => 
                          mod === userId || 
                          (typeof mod === 'object' && mod._id === userId)
                          );
                
                // Allow access if user is admin, organizer, or moderator
                if (isAdmin || isOrganizer || isModerator) {
                  setIsAuthorized(true);
                  setLoading(false);
                  return;
                }
              }
            } catch (error) {
              console.error('Error checking contest permissions:', error);
            }
          }
          
          // If not a contest page or user isn't organizer/moderator, fall back to admin-only check
          if (!isAdmin) {
            router.push('/unauthorized');
            return;
          }
        }
        
        // If we reach here, user is authorized
        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error('Error in auth check:', error);
        router.push('/auth/login');
      }
    };
    
    checkAuth();
  }, [router, adminOnly, contestId]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthorized ? <>{children}</> : null;
}