"use client";
import React from 'react';
import Image from 'next/image';
import { LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/dashboard/button';
import ProfilePictureUpload from './ProfilePictureUpload';

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  profile?: {
    name?: string;
    institution?: string;
    country?: string;
    avatarUrl?: string;
    bio?: string;
  };
  rating: number;
}

interface ProfileHeaderProps {
  user: User;
  onLogout: () => void;
  onProfileUpdate?: (newImageUrl: string) => void;  // Add this prop
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  onLogout,
  onProfileUpdate 
}) => {
  // State to keep track of the profile picture (so we can update it without reloading the page)
  const [profilePicture, setProfilePicture] = React.useState<string | undefined | null>(
    user.profilePicture || user.profile?.avatarUrl || null
  );
  
  // Handle profile picture update
  const handleProfilePictureUpdate = (newImageUrl: string) => {
    setProfilePicture(newImageUrl);
    // Also propagate the update up to the page component if needed
    if (onProfileUpdate) {
      onProfileUpdate(newImageUrl);
    }
  };
  
  return (
    <div className="bg-[#121B38] rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Picture with Upload Option */}
        <ProfilePictureUpload 
          currentImage={profilePicture} 
          username={user.username}
          onUpdate={handleProfilePictureUpdate} 
        />
        
        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">{user.username}</h1>
          
          <div className="mt-2 text-gray-400 text-sm md:text-base">
            <p>{user.email}</p>
            {user.profile?.institution && (
              <p className="mt-1">{user.profile.institution}</p>
            )}
            {user.profile?.country && (
              <p className="mt-1">{user.profile.country}</p>
            )}
          </div>
          
          {user.profile?.bio && (
            <p className="mt-4 text-gray-300">{user.profile.bio}</p>
          )}
          
          <div className="mt-6 flex items-center justify-center md:justify-start gap-2">
            <div className="bg-blue-900 px-4 py-1 rounded-full text-sm">
              Rating: <span className="font-bold">{user.rating}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-1 rounded-full text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;