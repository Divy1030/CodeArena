import React from 'react';
import Image from 'next/image';
import { LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/dashboard/button';

interface ProfileHeaderProps {
  user: any;
  onLogout: () => Promise<void>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onLogout }) => {
  // Get first letter of username for avatar fallback
  const userInitial = user.username ? user.username[0].toUpperCase() : 'U';
  
  return (
    <div className="bg-[#121B38] rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="relative">
        {user.profile?.avatarUrl ? (
          <Image 
            src={user.profile.avatarUrl}
            alt={user.username}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold">
            {userInitial}
          </div>
        )}
      </div>
      
      <div className="flex-grow text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-gray-400">{user.email}</p>
            {user.profile?.institution && (
              <p className="text-gray-300 mt-1">{user.profile.institution}</p>
            )}
            {user.profile?.country && (
              <p className="text-gray-300">{user.profile.country}</p>
            )}
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Edit size={16} />
              Edit Profile
            </Button>
            <Button 
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              onClick={onLogout}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
        
        {user.profile?.bio && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Bio</h3>
            <p className="text-gray-300 mt-1">{user.profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;