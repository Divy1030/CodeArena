"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface ProfilePictureUploadProps {
  currentImage?: string | null;
  username: string;
  onUpdate: (imageUrl: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  currentImage, 
  username,
  onUpdate 
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, or WEBP)');
      return;
    }
    
    // Validate file size (max 2MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      toast.error('Image must be smaller than 10MB');
      return;
    }
    
    // Upload the file
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload profile picture');
      }
      
      toast.success('Profile picture updated successfully');
      onUpdate(data.profilePicture);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };
  
  return (
    <div className="relative group">
      {/* Profile Picture */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-600">
        {currentImage ? (
          <Image 
            src={currentImage} 
            alt={`${username}'s profile picture`} 
            fill
            sizes="(max-width: 768px) 96px, 128px"
            className="object-cover"
            onError={(e) => {
              // If image fails to load, show initial
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full bg-blue-800 flex items-center justify-center">
                  <span class="text-3xl font-bold text-white">${username.charAt(0).toUpperCase()}</span>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full bg-blue-800 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Upload overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={triggerFileInput}
        >
          <div className="text-white">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <span className="text-xs mt-1 block">Change Photo</span>
          </div>
        </div>
        
        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
};

export default ProfilePictureUpload;