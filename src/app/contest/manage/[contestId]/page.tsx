"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "react-hot-toast";
import ContestBackgroundUpload from "@/components/contest/ContestBackgroundUpload";

interface ContestData {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  isRated: boolean;
  tags?: string[];
  rules?: string;
  organizationType?: string;
  organizationName?: string;
  prizes?: string;
  scoring?: string;
  landingPageTitle?: string;
  landingPageDescription?: string;
  landingPageImage?: string;
  backgroundImage?: string;
}

function ContestDetailsPage() {
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [contest, setContest] = useState<ContestData | null>(null);
  const [contestTitle, setContestTitle] = useState("");
  const [contestDescription, setContestDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTimeOnly, setStartTimeOnly] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTimeOnly, setEndTimeOnly] = useState("");
  const [landingPageTitle, setLandingPageTitle] = useState("");
  const [landingPageDescription, setLandingPageDescription] = useState("");
  const [prizes, setPrizes] = useState("");
  const [rules, setRules] = useState("");
  const [scoring, setScoring] = useState("");
  const [landingPageImage, ] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [contestUrl, setContestUrl] = useState("");
  
  const fetchContest = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/contest/getContestById/${contestId}`);
      const result = await response.json();

      if (result.success) {
        setContest(result.data);
        setContestTitle(result.data.title);
        setContestDescription(result.data.description || "");
        
        // Format dates for form inputs
        const start = new Date(result.data.startTime);
        const end = new Date(result.data.endTime);
        
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        
        // Format times as HH:MM
        setStartTimeOnly(('0' + start.getHours()).slice(-2) + ':' + ('0' + start.getMinutes()).slice(-2));
        setEndTimeOnly(('0' + end.getHours()).slice(-2) + ':' + ('0' + end.getMinutes()).slice(-2));
        
        setContestUrl(`https://code-arena-ivory.vercel.app/contest/${contestId}`);
        
        // Set other fields
        setLandingPageTitle(result.data.landingPageTitle || "");
        setLandingPageDescription(result.data.landingPageDescription || "");
        setPrizes(result.data.prizes || "");
        setRules(result.data.rules || "");
        setScoring(result.data.scoring || "");
        setBackgroundImage(result.data.backgroundImage || null);
      } else {
        toast.error("Failed to load contest details");
      }
    } catch {
      toast.error("Error fetching contest details");
    } finally {
      setIsLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    if (contestId) {
      fetchContest();
    }
  }, [contestId, fetchContest]);
  
  // Handler for background image updates
  const handleBackgroundUpdate = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setContest(prev => prev ? { ...prev, backgroundImage: imageUrl } : null);
  };

  const handleSaveChanges = async () => {
    try {
      let imageUrl = contest?.landingPageImage || "";
      if (landingPageImage) {
        const formData = new FormData();
        formData.append("file", landingPageImage);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
        }
      }

      // Combine date and time for start/end
      const newStartTime = new Date(`${startDate}T${startTimeOnly}:00`);
      const newEndTime = new Date(`${endDate}T${endTimeOnly}:00`);

      // Get token from localStorage
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/contest/updateContestDetails/${contestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: contestTitle,
          description: contestDescription,
          startTime: newStartTime.toISOString(),
          endTime: newEndTime.toISOString(),
          landingPageTitle,
          landingPageDescription,
          prizes,
          rules,
          scoring,
          landingPageImage: imageUrl,
          backgroundImage,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Contest details updated successfully");
        fetchContest(); // Refresh data
      } else {
        toast.error(`Failed to update contest details: ${result.message}`);
        console.error("Update error:", result);
      }
    } catch (error) {
      console.error("Error updating contest details:", error);
      toast.error("Error updating contest details");
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute adminOnly={false}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-white mb-6">Contest Details</h2>
        <p className="text-gray-300 mb-6">
          Customize your contest by providing more information needed to create your landing page. Your contest will only be available to those who have access to the contest URL.
        </p>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Contest Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contestTitle}
              onChange={(e) => setContestTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Contest URL
            </label>
            <div className="flex items-center">
              <input
                type="text"
                className="w-full bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-gray-400 focus:outline-none"
                value={contestUrl}
                disabled
              />
              <button 
                className="ml-2 text-blue-400 hover:text-blue-300"
                onClick={() => {
                  navigator.clipboard.writeText(contestUrl);
                  toast.success("URL copied to clipboard!");
                }}
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="date"
                  className="bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="self-center text-gray-300">at</span>
                <input
                  type="time"
                  className="bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startTimeOnly}
                  onChange={(e) => setStartTimeOnly(e.target.value)}
                />
                <span className="self-center text-gray-400">IST</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="date"
                  className="bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <span className="self-center text-gray-300">at</span>
                <input
                  type="time"
                  className="bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endTimeOnly}
                  onChange={(e) => setEndTimeOnly(e.target.value)}
                />
                <span className="self-center text-gray-400">IST</span>
              </div>
            </div>
          </div>
          
          {/* Contest Background Upload Component */}
          <div className="mt-8 pt-4 border-t border-gray-700">
            <ContestBackgroundUpload
              contestId={contestId}
              currentImage={backgroundImage}
              onUpdate={handleBackgroundUpdate}
            />
          </div>
          
          {/* Add more sections as needed */}
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href={`/contest/${contestId}/preview`}
              className="px-4 py-2 bg-transparent text-gray-300 border border-gray-700 rounded-md hover:bg-[#1e293b] text-center"
              target="_blank" // Add this to open in new tab
              rel="noopener noreferrer" // Security best practice for target="_blank"
            >
              Preview Landing Page
            </Link>
            <Link 
              href={`/contest/${contestId}/preview-challenges`}
              className="px-4 py-2 bg-transparent text-gray-300 border border-gray-700 rounded-md hover:bg-[#1e293b] text-center"
              target="_blank" // Add this to open in new tab
              rel="noopener noreferrer" // Security best practice
            >
              Preview Challenges Page
            </Link>
          </div>
          
          <button 
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ContestDetailsPage;