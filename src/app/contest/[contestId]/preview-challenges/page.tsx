"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Trophy, BarChart2, FileText } from "lucide-react";

// Using a simpler interface similar to your working preview page
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
  problems?: Array<{
    _id: string;
    title: string;
    difficulty: string;
    tags?: string[];
    timeLimit?: number;
    memoryLimit?: number;
    score?: number;
  }>;
}

function ContestChallengesPreview() {
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [contest, setContest] = useState<ContestData | null>(null);

  useEffect(() => {
    const fetchContestData = async () => {
      if (!contestId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/contest/getContestById/${contestId}`);
        const data = await response.json();
        
        if (data.success) {
          console.log("Contest data received:", data.data);
          setContest(data.data);
        } else {
          toast.error("Failed to load contest details");
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
        toast.error("Error loading contest");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestData();
  }, [contestId]);

  // Get difficulty color function
  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty?.toLowerCase() || '';
    switch (lowerDifficulty) {
      case "easy":
        return "text-green-500 bg-green-900/30";
      case "medium":
        return "text-yellow-500 bg-yellow-900/30";
      case "hard":
        return "text-red-500 bg-red-900/30";
      default:
        return "text-gray-400 bg-gray-700/30";
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen py-12 bg-[#0f172a]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!contest) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-[#0f172a]">
          <h1 className="text-2xl font-bold text-white">Contest not found</h1>
          <p className="mt-2 text-gray-400">The contest you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
          <Link href="/contests" className="mt-4 text-blue-500 hover:underline">
            Back to contests
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#1e293b] min-h-screen flex flex-col text-white">
        {/* Header Navigation */}
        <div className="bg-[#1e293b] border-b border-gray-700">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center text-gray-300 text-sm">
              <Link href="/contests" className="hover:text-blue-400">
                All Contests
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-400">{contest.title}</span>
            </div>
          </div>
        </div>

        {/* Contest Title Header */}
        <div className="bg-[#1e293b] border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h1 className="text-2xl font-bold text-white">{contest.title}</h1>
              <Link 
                href={`/contest/${contestId}/preview`}
                className="text-blue-400 hover:underline mt-2 md:mt-0"
                target="_blank"
              >
                Details ›
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Main Content */}
          <div className="flex-1 container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Challenges */}
              <div className="w-full md:w-3/4">
                <h2 className="text-xl font-medium text-white mb-6">Challenges</h2>
                
                {contest.problems && contest.problems.length > 0 ? (
                  <div className="bg-[#0f172a] border border-gray-700 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-[#0f172a] text-gray-300">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium">Title</th>
                          <th className="py-3 px-4 text-left font-medium">Difficulty</th>
                          <th className="py-3 px-4 text-left font-medium">Tags</th>
                          <th className="py-3 px-4 text-left font-medium">Time/Memory</th>
                          <th className="py-3 px-4 text-left font-medium">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contest.problems.map((problem) => (
                          <tr 
                            key={problem._id} 
                            className="border-t border-gray-700 hover:bg-[#1a2540]"
                          >
                            <td className="py-3 px-4 font-medium text-white">
                              <Link href={`/contest/${contestId}/problem/${problem._id}`} className="hover:text-blue-400">
                                {problem.title || "Unnamed Problem"}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty ? 
                                  problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) : 
                                  "Unknown"
                                }
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {problem.tags && problem.tags.length > 0 ? (
                                  <>
                                    {problem.tags.slice(0, 3).map((tag, i) => (
                                      <span key={i} className="bg-[#0f172a] text-blue-400 text-xs px-2 py-1 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                    {problem.tags.length > 3 && (
                                      <span className="text-xs text-gray-400">+{problem.tags.length - 3}</span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-gray-400 text-xs">No tags</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {problem.timeLimit || 1}ms / {problem.memoryLimit || 256}MB
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {problem.score || 100}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[#121B38] border border-gray-700 rounded-md">
                    <p className="text-gray-400">There are no matching challenges.</p>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="w-full md:w-1/4">
                {/* Current Rank */}
                <div className="mb-6">
                  <div className="bg-[#121B38] border border-gray-700 rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-300">Current Rank:</h3>
                      <span className="text-sm text-gray-400">N/A</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <a href="#" className="text-gray-500 hover:text-gray-300">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-300">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-300">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tools Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <Trophy size={18} />
                    <Link href={`/contest/${contestId}/leaderboard`} className="text-sm">
                      Current Leaderboard
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <BarChart2 size={18} />
                    <Link href={`/contest/${contestId}/progress`} className="text-sm">
                      Compare Progress
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <FileText size={18} />
                    <Link href={`/contest/${contestId}/submissions`} className="text-sm">
                      Review Submissions
                    </Link>
                  </div>
                </div>

                {/* Admin Options */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Admin Options</h3>
                  <div className="space-y-2">
                    <div className="text-blue-400 hover:text-blue-300">
                      <Link href={`/contest/manage/${contestId}`} className="text-sm">
                        Manage Contest
                      </Link>
                    </div>
                    <div className="text-blue-400 hover:text-blue-300">
                      <Link href={`/contest/manage/${contestId}/challenges`} className="text-sm">
                        Manage Challenges
                      </Link>
                    </div>
                    <div className="text-blue-400 hover:text-blue-300">
                      <Link href={`/contest/${contestId}/all-submissions`} className="text-sm">
                        View All Submissions
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContestChallengesPreview;