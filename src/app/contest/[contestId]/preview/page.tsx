"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

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

function ContestPreviewPage() {
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [contest, setContest] = useState<ContestData | null>(null);
  const [, setError] = useState("");

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/contest/getContestById/${contestId}`);
        const result = await response.json();

        if (result.success) {
          setContest(result.data);
        } else {
          toast.error("Failed to load contest details");
          setError("Failed to load contest details");
        }
      } catch  {
        toast.error("Error fetching contest details");
        setError("Error fetching contest details");
      } finally {
        setIsLoading(false);
      }
    };

    if (contestId) {
      fetchContest();
    }
  }, [contestId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Contest not found</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">The contest you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
        <Link href="/contests" className="mt-4 text-blue-500 hover:underline">
          Back to contests
        </Link>
      </div>
    );
  }

  const displayTitle = contest.landingPageTitle || contest.title;
  const displayDescription = contest.landingPageDescription || contest.description;
  const startDate = new Date(contest.startTime);
  const endDate = new Date(contest.endTime);
  const formattedDateRange = `${startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
  })} ${startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  })} to ${endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
  })} ${endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  })}`;

  return (
    <div className="bg-white dark:bg-[#121B38] min-h-screen flex flex-col">
      {/* Use your existing Navbar */}
      <Navbar />

      {/* Hero Section with Background Image */}
      <div className="relative w-full h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 z-10"></div>
        {contest.backgroundImage ? (
          <Image 
            src={contest.backgroundImage}
            alt={displayTitle}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-800"></div>
        )}
        
        {/* Content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">{displayTitle}</h1>
          <p className="text-xl text-white/90 mb-6 text-center">{formattedDateRange}</p>
          <button className="bg-blue-500 text-white text-lg px-8 py-3 rounded-md transition-colors">
            Sign Up
          </button>
        </div>
      </div>

      {/* Contest Navigation */}
      <div className="bg-white dark:bg-[#0F172A] shadow-md py-4">
        <div className="container mx-auto px-4">
          <nav className="flex justify-center space-x-8">
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</a>
            {contest.prizes && (
              <a href="#prizes" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Prizes</a>
            )}
            {contest.rules && (
              <a href="#rules" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Rules</a>
            )}
            {contest.scoring && (
              <a href="#scoring" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Scoring</a>
            )}
          </nav>
        </div>
      </div>

      {/* Content Sections - Center all text */}
      <div className="container mx-auto px-4 py-12">
        <section id="about" className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">About</h2>
          <div className="prose max-w-none dark:prose-invert prose-lg mx-auto">
            {displayDescription ? (
              <p className="text-gray-600 dark:text-gray-300 text-center">{displayDescription}</p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-center">Please provide a short description of your contest here! This will also be used as metadata.</p>
            )}
          </div>
        </section>

        {contest.prizes && (
          <section id="prizes" className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Prizes</h2>
            <div className="prose max-w-none dark:prose-invert prose-lg mx-auto">
              <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-center">
                {contest.prizes}
              </div>
            </div>
          </section>
        )}

        {contest.rules && (
          <section id="rules" className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Rules</h2>
            <div className="prose max-w-none dark:prose-invert prose-lg mx-auto">
              <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-center">
                {contest.rules}
              </div>
            </div>
          </section>
        )}

        {contest.scoring && (
          <section id="scoring" className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Scoring</h2>
            <div className="prose max-w-none dark:prose-invert prose-lg mx-auto">
              <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-center">
                {contest.scoring}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Use your existing Footer */}
      <Footer />
    </div>
  );
}

export default ContestPreviewPage;