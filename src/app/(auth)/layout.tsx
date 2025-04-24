'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CanvasLogin from '@/components/Custom/CanvasLogin';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const pathname = usePathname();
    
    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex md:w-1/2 bg-blue-50 relative items-center justify-center overflow-hidden">
                <div className="canvas-container w-full h-full">
                    <CanvasLogin />
                </div>
            </div>
            
            {/* Right side with auth form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold">Code-Up</h1>
                        <p className="text-gray-600 mt-2">
                            {pathname.includes('/login') ? 'Sign in to your account' : 'Create a new account'}
                        </p>
                    </div> */}
                    
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="flex justify-center space-x-4 mb-6">
                            <Link 
                                href="/login" 
                                className={`px-4 py-2 ${pathname === '/auth/login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            >
                                Login
                            </Link>
                            <Link 
                                href="/register" 
                                className={`px-4 py-2 ${pathname === '/auth/register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            >
                                Register
                            </Link>
                        </div>
                        
                        {children}
                    </div>
                    
                    <p className="text-center text-gray-600 text-sm mt-8">
                        &copy; {new Date().getFullYear()} Code-Up. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}