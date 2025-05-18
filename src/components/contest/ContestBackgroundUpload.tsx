"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';

interface ContestBackgroundUploadProps {
  contestId: string;
  currentImage?: string | null;
  onUpdate: (imageUrl: string) => void;
}

const ContestBackgroundUpload: React.FC<ContestBackgroundUploadProps> = ({
  contestId,
  currentImage,
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
    
    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      toast.error('Image must be smaller than 10MB');
      return;
    }
    
    // Upload the file
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('backgroundImage', file);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/contest/upload-background/${contestId}`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload contest background');
      }
      
      toast.success('Contest background updated successfully');
      onUpdate(data.backgroundImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload contest background');
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
    <div className="w-full">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-lg font-medium">Contest Background</h3>
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded flex items-center gap-1"
        >
          <Upload size={14} />
          {uploading ? 'Uploading...' : 'Upload Background'}
        </button>
      </div>
      
      <div className="relative group border-2 border-dashed border-gray-600 rounded-lg overflow-hidden bg-gray-800 hover:border-gray-400 transition-colors">
        {currentImage ? (
          <div className="relative w-full h-48">
            <Image
              src={currentImage}
              alt="Contest Background"
              fill
              className="object-cover"
              onError={(e) => {
                // If image fails to load, show placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span class="text-gray-400">No image available</span>
                  </div>
                `;
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <div onClick={triggerFileInput} className="cursor-pointer text-white flex flex-col items-center">
                <Upload size={24} />
                <span className="mt-2 text-sm">Change Background</span>
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={triggerFileInput}
            className="w-full h-48 flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload size={24} className="text-gray-400" />
            <span className="mt-2 text-gray-400">Upload contest background image</span>
            <span className="mt-1 text-gray-500 text-sm">(Recommended: 1920 x 1080px)</span>
          </div>
        )}
        
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

export default ContestBackgroundUpload;