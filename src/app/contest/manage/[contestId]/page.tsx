"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/dashboard/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "react-hot-toast";

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
}

function page() {

    const params = useParams();
    const contestId = params?.contestId as string;
  
    const [isLoading, setIsLoading] = useState(true);
    const [contest, setContest] = useState<ContestData | null>(null);
    const [contestTitle, setContestTitle] = useState("");
    const [contestDescription, setContestDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [duration, setDuration] = useState("");

    const [landingPageTitle, setLandingPageTitle] = useState("");
    const [landingPageDescription, setLandingPageDescription] = useState("");
    const [prizes, setPrizes] = useState("");
    const [rules, setRules] = useState("");
    const [scoring, setScoring] = useState("");
    const [landingPageImage, setLandingPageImage] = useState<File | null>(null);
  
    const fetchContest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/contest/getContestById/${contestId}`);
        const result = await response.json();

        if (result.success) {
          setContest(result.data);
          setContestTitle(result.data.title);
          setContestDescription(result.data.description || "");
          setStartTime(result.data.startTime);
          setEndTime(result.data.endTime);
          setDuration(String(result.data.duration));
        } else {
          toast.error("Failed to load contest details");
        }
      } catch (error) {
        toast.error("Error fetching contest details");
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (contestId) {
      fetchContest();
    }
  }, [contestId]);

  useEffect(() => {
    if (contest) {
      setLandingPageTitle(contest.landingPageTitle || "");
      setLandingPageDescription(contest.landingPageDescription || "");
      setPrizes(contest.prizes || "");
      setRules(contest.rules || "");
      setScoring(contest.scoring || "");
      // landingPageImage is handled separately (file upload)
    }
  }, [contest]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLandingPageImage(e.target.files[0]);
    }
  };

  const handleSaveContestDetails = async () => {
    try {
      let imageUrl = contest?.landingPageImage || "";
      // Handle image upload if a new image is selected
      if (landingPageImage) {
        const formData = new FormData();
        formData.append("file", landingPageImage);
        // Replace with your actual upload endpoint
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
        }
      }

      const response = await fetch(`/api/contest/updateContestDetails/${contestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: contestTitle,
          description: contestDescription,
          startTime,
          endTime,
          duration: Number(duration),
          landingPageTitle,
          landingPageDescription,
          prizes,
          rules,
          scoring,
          landingPageImage: imageUrl,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Contest details updated successfully");
      } else {
        toast.error("Failed to update contest details");
      }
    } catch (error) {
      toast.error("Error updating contest details");
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
  
    if (!contest) {
      return (
        <ProtectedRoute adminOnly={true}>
          <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
            <p>Contest not found.</p>
          </div>
        </ProtectedRoute>
      );
    }

    

  return (
  <ProtectedRoute adminOnly={true}>
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="bg-[#1e293b] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Contest Details</h2>
          <input
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Contest Title"
            value={contestTitle}
            onChange={(e) => setContestTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Contest Description"
            value={contestDescription}
            onChange={(e) => setContestDescription(e.target.value)}
          />
          <input
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <input
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Duration (in minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Button variant="primary" className="mt-4" onClick={handleSaveContestDetails}>
            Save Contest Details
          </Button>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Landing Page Customization</h2>
          <div className="mb-4">
            <label className="block mb-1">Background Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-white" />
            {contest?.landingPageImage && (
              <img src={contest.landingPageImage} alt="Current" className="mt-2 h-24 rounded" />
            )}
          </div>
          <input
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Tagline"
            value={landingPageTitle}
            onChange={(e) => setLandingPageTitle(e.target.value)}
            maxLength={100}
          />
          <textarea
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Description"
            value={landingPageDescription}
            onChange={(e) => setLandingPageDescription(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Prizes"
            value={prizes}
            onChange={(e) => setPrizes(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-2 bg-[#2e3b4e] text-white rounded"
            placeholder="Scoring"
            value={scoring}
            onChange={(e) => setScoring(e.target.value)}
          />
        </div>
      </div>
    </div>
  </ProtectedRoute>
  );
}

export default page;
