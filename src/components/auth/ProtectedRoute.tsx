"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      if (!token || !userData) {
        router.push('/auth/login');
        return;
      }
      
      if (adminOnly && !isAdmin) {
        // If admin-only route but user is not admin
        router.push('/user/home');
        return;
      }
      
      setIsAuthorized(true);
      setLoading(false);
    };
    
    checkAuth();
  }, [router, adminOnly]);
  
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