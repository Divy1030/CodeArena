"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminProfileHeader from '@/components/admin/AdminProfileHeader';
import AdminStats from '@/components/admin/AdminStats';
import AdminContests from '@/components/admin/AdminContests';
import SecuritySettings from '@/components/profile/SecuritySettings';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Participant {
  _id: string;
  username: string;
  email: string;
}

interface Contest {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status?: string;
  participants?: Participant[];
}

interface AdminData {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  password?: string;
  role: string;
  contestsCreated?: Contest[];
  profile?: {
    name?: string;
    institution?: string;
    country?: string;
    bio?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Get token from localStorage (for Google login users)
        const token = localStorage.getItem('token');
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/admin/get-admin', {
          method: 'GET',
          headers
        });
        
        const result = await response.json();
        
        if (result.success) {
          setAdminData(result.data);
        } else {
          setError(result.message || 'Failed to fetch admin data');
          toast.error(result.message || 'Failed to fetch admin data');
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            toast.error('Session expired. Please login again.');
            setTimeout(() => {
              router.push('/admin/login');
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('An error occurred while fetching admin data');
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [router]);

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    try {
      // Get token from localStorage
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
        router.push('/admin/login');
      } else {
        // Even if backend logout fails, clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('isAdmin');
        
        toast.error('Local session ended. Server logout failed.');
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Error logging out:', err);
      
      // Clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('isAdmin');
      
      toast.error('Local session ended. Server logout failed.');
      router.push('/admin/login');
    }
  };

  // Add special handling for Google login users
  const isGoogleUser = adminData && !adminData.password;
  
  // Add handler for profile picture update
  const handleProfilePictureUpdate = (newImageUrl: string) => {
    // Update the admin data with the new profile picture
    if (adminData) {
      setAdminData({
        ...adminData,
        profilePicture: newImageUrl
      });
      
      // Update the user data in localStorage if it exists
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          userData.profilePicture = newImageUrl;
          localStorage.setItem('userData', JSON.stringify(userData));
        } catch (e) {
          console.error('Error updating stored user data:', e);
        }
      }
    }
  };

  return (
    <ProtectedRoute adminOnly>
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
          ) : adminData ? (
            <div className="space-y-8">
              <AdminProfileHeader 
                admin={adminData} 
                onLogout={handleLogout}
                onProfileUpdate={handleProfilePictureUpdate} // Add this prop
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <AdminStats admin={adminData} />
                  <AdminContests contests={adminData.contestsCreated || []} />
                </div>
                <div className="lg:col-span-1">
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
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl">No admin data found</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminProfilePage;