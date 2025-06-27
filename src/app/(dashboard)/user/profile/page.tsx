"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileActivity from '@/components/profile/ProfileActivity';
import SecuritySettings from '@/components/profile/SecuritySettings';
import ManageableContests from '@/components/profile/ManageableContests';
import SocialFeatures from '@/components/profile/SocialFeatures';
import FollowingList from '@/components/profile/FollowingList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Define the interface for contest data
interface Contest {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  joinedAt?: string;
  rank?: number | string;
  score?: number;
  [key: string]: unknown; // Add index signature for compatibility
}

// Define the interface for user data
interface UserData {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  password?: string;
  rating: number;
  contestsParticipated?: Contest[];
  solvedProblems?: Array<{
    problemId?: { _id: string; title: string; difficulty?: string } | string;
    solvedAt?: string;
  }>;
  following?: Array<{ _id: string; username?: string; profilePicture?: string }>;
  followers?: Array<{ _id: string; username?: string; profilePicture?: string }>;
  [key: string]: unknown; // For any other properties
}

const UserProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage (for Google login users)
        const token = localStorage.getItem('token');
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers
        });
        
        const result = await response.json();
        
        if (result.success) {
          setUserData(result.data);
        } else {
          setError(result.message || 'Failed to fetch user data');
          toast.error(result.message || 'Failed to fetch user data');
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            toast.error('Session expired. Please login again.');
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('An error occurred while fetching user data');
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    try {
      // Get token from localStorage (for Google login users)
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Password changed successfully');
        return true;
      } else {
        toast.error(result.message || 'Failed to change password');
        return false;
      }
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error('An error occurred while changing password');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('isAdmin');
        
        toast.success('Logged out successfully');
        router.push('/login');
      } else {
        // Even if backend logout fails, clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('isAdmin');
        
        router.push('/login');
      }
    } catch (err) {
      console.error('Error logging out:', err);
      
      // Clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('isAdmin');
      
      router.push('/login');
    }
  };

  // Add special handling for Google login users
  const isGoogleUser = userData && !userData.password;

  const handleProfilePictureUpdate = (newImageUrl: string) => {
    // Update the user data with the new profile picture
    if (userData) {
      setUserData({
        ...userData,
        profilePicture: newImageUrl
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-[80vh]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p className="text-xl">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : userData ? (
            <div className="space-y-8">
              <ProfileHeader 
                user={userData} 
                onLogout={handleLogout}
                onProfileUpdate={handleProfilePictureUpdate}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <ProfileStats user={userData} />
                  <ProfileActivity user={userData} />
                </div>
                <div className="lg:col-span-1 space-y-8">
                  {/* Security Settings */}
                  {isGoogleUser ? (
                    <div className="bg-[#121B38] rounded-xl p-6">
                      <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                      <p className="text-gray-400">
                        You signed in with Google. Password management is not available for Google accounts.
                      </p>
                    </div>
                  ) : (
                    <SecuritySettings onPasswordChange={handlePasswordChange} />
                  )}
                  
                  {/* Following/Followers List */}
                  <FollowingList userData={userData} />
                  
                  {/* Social Features - Search and Suggested Users */}
                  <SocialFeatures currentUserId={userData._id} />
                  
                  {/* Manageable Contests */}
                  <ManageableContests userId={userData._id} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl">No user data found</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserProfilePage;