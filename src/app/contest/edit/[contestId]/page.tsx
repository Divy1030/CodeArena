"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/dashboard/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
// import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

// Interface for contest data
interface ContestData {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  problems?: string[];
  isRated: boolean;
  tags?: string[];
  rules?: string;
}

const EditContestPage = () => {
  const router = useRouter();
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ContestData>({
    _id: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 120,
    isRated: true,
    tags: [],
    rules: '',
  });
  const [tagInput, setTagInput] = useState('');

  // Fetch contest data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/contest/getContestById/${contestId}`);
        const result = await response.json();
        
        if (result.success) {
          // Format dates for input fields
          const contestData = result.data;
          setFormData({
            _id: contestData._id,
            title: contestData.title,
            description: contestData.description || '',
            startTime: formatDateForInput(contestData.startTime),
            endTime: formatDateForInput(contestData.endTime),
            duration: contestData.duration,
            isRated: contestData.isRated,
            tags: contestData.tags || [],
            rules: contestData.rules || '',
          });
        } else {
          toast.error("Failed to load contest details");
          console.error("API Error:", result);
        }
      } catch (error) {
        toast.error("Error fetching contest details");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (contestId) {
      fetchContest();
    }
  }, [contestId]);

  // Format date for datetime-local input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Update duration when start or end time changes
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      
      if (diffMinutes > 0) {
        setFormData(prev => ({ ...prev, duration: diffMinutes }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        duration: formData.duration,
        isRated: formData.isRated,
        tags: formData.tags,
        rules: formData.rules,
      };

      const response = await fetch(`/api/contest/edit-contest/${contestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("Contest updated successfully");
        router.push('/admin/home');
      } else {
        toast.error(result.message || "Failed to update contest");
        console.error("API Error:", result);
      }
    } catch (error) {
      toast.error("Error updating contest");
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Edit Contest</h1>
            <Link href="/admin/home">
              <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#1e293b] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Contest Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                      Start Time*
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f172a] border border-gray-700 rounded p-2"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                      End Time*
                    </label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f172a] border border-gray-700 rounded p-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium mb-1">
                    Duration (minutes)*
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="30"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-[#1e293b] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Contest Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRated"
                    name="isRated"
                    checked={formData.isRated}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRated: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isRated" className="ml-2 block text-sm">
                    This is a rated contest
                  </label>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-1">
                    Tags
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="tagInput"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-grow bg-[#0f172a] border border-gray-700 rounded-l p-2"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags?.map((tag, index) => (
                      <div key={index} className="bg-blue-800 text-white text-sm rounded-full px-3 py-1 flex items-center">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-white hover:text-red-300 focus:outline-none"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="rules" className="block text-sm font-medium mb-1">
                    Contest Rules
                  </label>
                  <textarea
                    id="rules"
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2"
                    placeholder="Enter contest rules and guidelines..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link href="/admin/home">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Update Contest'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditContestPage;