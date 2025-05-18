"use client";

import React from 'react';
import Image from 'next/image';
import { LogOut, Edit, Shield } from 'lucide-react';
import { Button } from '@/components/ui/dashboard/button';
import ProfilePictureUpload from '../profile/ProfilePictureUpload';

interface AdminProfileHeaderProps {
  admin: any;
  onLogout: () => Promise<void>;
  onProfileUpdate?: (newImageUrl: string) => void;
}

const AdminProfileHeader: React.FC<AdminProfileHeaderProps> = ({ 
  admin, 
  onLogout,
  onProfileUpdate 
}) => {
  // Get first letter of username for avatar fallback
  const adminInitial = admin.username ? admin.username[0].toUpperCase() : 'A';
  
  return (
    <div className="bg-[#121B38] border border-gray-700 rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Picture with Upload functionality */}
        <ProfilePictureUpload 
          currentImage={admin.profilePicture} 
          username={admin.username}
          onUpdate={(newImageUrl) => {
            if (onProfileUpdate) {
              onProfileUpdate(newImageUrl);
            }
          }}
        />
        
        {/* Admin Info */}
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-2xl font-bold">{admin.username}</h1>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
            <span className="px-3 py-1 text-sm rounded-full bg-purple-900/50 text-purple-300 inline-block">
              Administrator
            </span>
            {admin.role === "super-admin" && (
              <span className="px-3 py-1 text-sm rounded-full bg-red-900/50 text-red-300 inline-block">
                Super Admin
              </span>
            )}
          </div>
          
          <p className="text-gray-400 mt-2">
            {admin.email}
          </p>
          
          <p className="text-gray-400 mt-1">
            Member since {new Date(admin.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Admin Actions */}
        <div className="flex flex-col gap-3 self-start">
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileHeader;