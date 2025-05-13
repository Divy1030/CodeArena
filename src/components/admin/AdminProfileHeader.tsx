import React from 'react';
import Image from 'next/image';
import { LogOut, Edit, Shield } from 'lucide-react';
import { Button } from '@/components/ui/dashboard/button';

interface AdminProfileHeaderProps {
  admin: any;
  onLogout: () => Promise<void>;
}

const AdminProfileHeader: React.FC<AdminProfileHeaderProps> = ({ admin, onLogout }) => {
  // Get first letter of username for avatar fallback
  const adminInitial = admin.username ? admin.username[0].toUpperCase() : 'A';
  
  return (
    <div className="bg-[#121B38] rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="relative">
        {admin.profile?.avatarUrl ? (
          <Image 
            src={admin.profile.avatarUrl}
            alt={admin.username}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-purple-600 flex items-center justify-center text-4xl font-bold relative">
            {adminInitial}
            <div className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full">
              <Shield size={20} />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-grow text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{admin.username}</h1>
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-md uppercase">
                Admin
              </span>
            </div>
            <p className="text-gray-400">{admin.email}</p>
            {admin.profile?.institution && (
              <p className="text-gray-300 mt-1">{admin.profile.institution}</p>
            )}
            {admin.profile?.country && (
              <p className="text-gray-300">{admin.profile.country}</p>
            )}
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
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
        
        {admin.profile?.bio && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Bio</h3>
            <p className="text-gray-300 mt-1">{admin.profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfileHeader;