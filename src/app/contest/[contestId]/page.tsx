"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ContestDetails from '@/components/contest/ContestDetails';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

// Define a Contest interface to replace 'any'
interface Contest {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration?: number;
  isRated?: boolean;
  tags?: string[];
  rules?: string;
  organizationType?: string;
  organizationName?: string;
  prizes?: string;
  scoring?: string;
  participants?: Array<{ userId: string; joinedAt: string }>;
  [key: string]: unknown; // For any other properties
}

export default function ContestDetailsPage() {
  const { contestId } = useParams();
  // Remove unused router import/variable
  const searchParams = useSearchParams();
  const returnPath = searchParams.get('returnPath');
  const isAdmin = searchParams.get('isAdmin') === 'true';
  
  const [contest, setContest] = useState<Contest | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin from localStorage
    const checkUserRole = () => {
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      setUserRole(isAdminUser ? 'admin' : 'user');
    };
    
    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contest/getContestById/${contestId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch contest');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setContest(data.data);
        } else {
          throw new Error(data.message || 'Failed to load contest details');
        }
      } catch (err) {
        console.error('Error fetching contest:', err);
        setError('Failed to load contest details');
        toast.error('Failed to load contest details');
      } finally {
        setLoading(false);
      }
    };
    
    if (contestId) {
      fetchContest();
    }
  }, [contestId]);

  // Determine where to return based on user role and provided returnPath
  const getReturnPath = () => {
    if (returnPath) return returnPath;
    
    if (userRole === 'admin') {
      return '/admin/profile';
    }
    
    return '/user/profile';
  };

  return (
    <ProtectedRoute adminOnly={false}>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link 
            href={getReturnPath()}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {returnPath?.includes('admin') ? 'Admin Dashboard' : 'Profile'}
          </Link>
          
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white"
              >
                Try Again
              </button>
            </div>
          ) : contest ? (
            <ContestDetails 
              contest={contest} 
              isAdmin={isAdmin || userRole === 'admin'} 
            />
          ) : (
            <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-400">Contest not found</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}