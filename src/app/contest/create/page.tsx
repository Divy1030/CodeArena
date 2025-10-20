"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ContestForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 120, // default 2 hours in minutes
    problems: [] as string[], // Will be populated later
    isRated: true,
    tags: [] as string[],
    rules: '',
    // Additional UI controls
    enableVirtualMode: true,
    showLeaderboard: true,
    allowLateSubmissions: true,
    enableDiscussionForum: true,
    difficultyLevel: 'Medium',
    maxParticipants: 100,
    numberOfProblems: 3,
    timeLimit: 2, // seconds
    memoryLimit: 256, // MB
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const calculateEndTime = () => {
    if (!formData.startTime) return;
    
    const startDate = new Date(formData.startTime);
    const endDate = new Date(startDate.getTime() + formData.duration * 60000);
    
    // Format for datetime-local input
    const endTimeStr = endDate.toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, endTime: endTimeStr }));
  };

  // Update end time when start time or duration changes
  useEffect(() => {
    calculateEndTime();
  }, [formData.startTime, formData.duration,calculateEndTime]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags: string[] = e.target.value.split(',').map((tag: string) => tag.trim());
    setFormData({ ...formData, tags });
  };

  const handleCreateContest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate dummy problem IDs for testing
      // In a real app, you would select actual problems from a problem bank
      const dummyProblems = Array(formData.numberOfProblems || 3)
        .fill(0)
        .map(() => ObjectId().toString());

      const contestData = {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
        duration: formData.duration,
        problems: dummyProblems,
        isRated: formData.isRated,
        tags: formData.tags,
        rules: formData.rules || 'Default contest rules apply.'
      };

      const response = await fetch('/api/contest/create-contest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contestData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Contest created successfully!');
        router.push('/admin/home');
      } else {
        toast.error(result.message || 'Failed to create contest');
      }
    } catch (error) {
      console.error('Error creating contest:', error);
      toast.error('An error occurred while creating the contest');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <Head>
          <title>Create Contest | Code-Up</title>
          <meta name="description" content="Create a new coding contest" />
        </Head>
        
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between bg-[#1e293b]">
          <h1 className="text-2xl font-bold">Create Coding Contest</h1>
          <Link href="/admin/home" className="text-blue-400 hover:underline">
            Back to Dashboard
          </Link>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8 max-w-4xl mx-auto">
          <form onSubmit={handleCreateContest} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-[#1e293b] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Contest Title*</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter Contest Title" 
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter Contest Description" 
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time*</label>
                  <input 
                    type="datetime-local" 
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)*</label>
                  <input 
                    type="number" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="30"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty Level</label>
                  <select 
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <input 
                    type="text" 
                    placeholder="algorithms,data structures,dynamic programming" 
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                    onChange={handleTagsChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Problem Settings Section */}
            <div className="bg-[#1e293b] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Problem Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Problems*</label>
                  <input 
                    type="number" 
                    name="numberOfProblems"
                    value={formData.numberOfProblems}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Maximum Participants</label>
                  <input 
                    type="number" 
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Time Limit (Seconds)</label>
                  <input 
                    type="number" 
                    name="timeLimit"
                    value={formData.timeLimit}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Memory Limit (MB)</label>
                  <input 
                    type="number" 
                    name="memoryLimit"
                    value={formData.memoryLimit}
                    onChange={handleInputChange}
                    min="64"
                    max="512"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Rules & Guidelines Section */}
            <div className="bg-[#1e293b] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Rules & Guidelines</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Contest Rules</label>
                <textarea 
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  placeholder="Enter contest rules and guidelines" 
                  className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-sm h-32"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="defaultRule1" 
                    className="mr-2" 
                    checked 
                    readOnly 
                  />
                  <label htmlFor="defaultRule1" className="text-sm">Participants must solve problems independently.</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="defaultRule2" 
                    className="mr-2" 
                    checked 
                    readOnly 
                  />
                  <label htmlFor="defaultRule2" className="text-sm">No external code references allowed.</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="defaultRule3" 
                    className="mr-2" 
                    checked 
                    readOnly 
                  />
                  <label htmlFor="defaultRule3" className="text-sm">Solutions must pass all test cases.</label>
                </div>
              </div>
            </div>
            
            {/* Additional Settings Section */}
            <div className="bg-[#1e293b] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Additional Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-[#0f172a] border border-gray-700 rounded p-3">
                  <span className="text-sm">Virtual Mode</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="enableVirtualMode"
                      id="enableVirtualMode"
                      checked={formData.enableVirtualMode}
                      onChange={handleInputChange}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="enableVirtualMode"
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.enableVirtualMode ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-[#0f172a] border border-gray-700 rounded p-3">
                  <span className="text-sm">Show Leaderboard</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="showLeaderboard"
                      id="showLeaderboard"
                      checked={formData.showLeaderboard}
                      onChange={handleInputChange}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="showLeaderboard"
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.showLeaderboard ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-[#0f172a] border border-gray-700 rounded p-3">
                  <span className="text-sm">Late Submissions</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="allowLateSubmissions"
                      id="allowLateSubmissions"
                      checked={formData.allowLateSubmissions}
                      onChange={handleInputChange}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="allowLateSubmissions"
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.allowLateSubmissions ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-[#0f172a] border border-gray-700 rounded p-3">
                  <span className="text-sm">Discussion Forum</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="enableDiscussionForum"
                      id="enableDiscussionForum"
                      checked={formData.enableDiscussionForum}
                      onChange={handleInputChange}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="enableDiscussionForum"
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.enableDiscussionForum ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-[#0f172a] border border-gray-700 rounded p-3">
                  <span className="text-sm">Rated Contest</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="isRated"
                      id="isRated"
                      checked={formData.isRated}
                      onChange={handleInputChange}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="isRated"
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.isRated ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Submission */}
            <div className="flex items-center justify-between">
              <Link href="/admin/home" className="text-gray-400 hover:text-white">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 font-medium disabled:opacity-70"
              >
                {isSubmitting ? 'Creating...' : 'Create Contest'}
              </button>
            </div>
          </form>
        </main>

        {/* CSS for custom toggle switch */}
        <style jsx>{`
          .toggle-checkbox:checked {
            right: 0;
            border-color: #3b82f6;
          }
          .toggle-checkbox:checked + .toggle-label {
            background-color: #3b82f6;
          }
          .toggle-checkbox {
            right: 0;
            z-index: 20;
            border-color: #888;
            transition: all 0.3s;
          }
          .toggle-label {
            width: 100%;
            transition: all 0.3s;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
};

// Helper function to generate ObjectId for testing
const ObjectId = () => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
  const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  return timestamp + machineId + processId + counter;
};

export default ContestForm;