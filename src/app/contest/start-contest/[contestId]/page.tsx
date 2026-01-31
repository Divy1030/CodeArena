"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Trophy, BarChart2, FileText } from "lucide-react";

interface Participant {
  userId: string;
  username?: string;
  joinedAt?: string;
  score?: number;
  rank?: number;
  submissions?: Array<{
    problemId: string;
    status: string;
    submittedAt: string;
    score?: number;
  }>;
}

interface ContestData {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  isRated: boolean;
  participants?: Participant[];
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

function formatTime(ms: number) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

const StartContestPage = () => {
  const params = useParams();
  const router = useRouter();
  const contestId = params?.contestId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contest, setContest] = useState<ContestData | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  // Fetch user's solved problems for this contest
  const fetchUserProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      
      if (userData && token) {
        const user = JSON.parse(userData);
        const contestEntry = user.contestsParticipated?.find(
          (c: any) => c._id === contestId || c.contestId === contestId
        );
        
        if (contestEntry?.contestProblems) {
          const solved = new Set<string>();
          contestEntry.contestProblems.forEach((cp: any) => {
            if (cp.submissionStatus === "correct") {
              solved.add(cp.problemId._id || cp.problemId);
            }
          });
          setSolvedProblems(solved);
        }
      }
    } catch (err) {
      console.error("Error fetching user progress:", err);
    }
  };

  useEffect(() => {
    const startContest = async () => {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`/api/contest/start-contest/${contestId}`, {
          method: "GET",
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          console.log("Contest data received:", data.data[0]);
          setContest(data.data[0]);
          // Fetch user progress after loading contest
          await fetchUserProgress();
        } else {
          setError(data.message || "Failed to start contest.");
          toast.error("Failed to load contest details");
        }
      } catch (err) {
        console.error("Error starting contest:", err);
        setError("Error starting contest.");
        toast.error("Error loading contest");
      } finally {
        setLoading(false);
      }
    };
    if (contestId) startContest();
  }, [contestId]);

  // Listen for problem solved events
  useEffect(() => {
    const handleProblemSolved = () => {
      console.log('\ud83d\udd14 userDataUpdated event received in challenges page');
      console.log('Current solved problems before refresh:', solvedProblems);
      fetchUserProgress();
    };

    console.log('\ud83c\udfaf Setting up userDataUpdated listener for challenges page');
    window.addEventListener('userDataUpdated', handleProblemSolved);
    return () => {
      console.log('\ud83e\uddf9 Cleaning up userDataUpdated listener');
      window.removeEventListener('userDataUpdated', handleProblemSolved);
    };
  }, [contestId, solvedProblems]);

  // Timer for time left till contest end
  useEffect(() => {
    if (!contest) return;
    const end = new Date(contest.endTime).getTime();

    const updateTimeLeft = () => {
      const now = Date.now();
      setTimeLeft(formatTime(end - now));
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [contest]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12 bg-[#0f172a]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-[#0f172a]">
        <h1 className="text-2xl font-bold text-white">Contest Error</h1>
        <p className="mt-2 text-gray-400">{error}</p>
        <Link href="/contests" className="mt-4 text-blue-500 hover:underline">
          Back to contests
        </Link>
      </div>
    );
  }

  if (!contest) return null;

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col text-white">
      {/* Header Navigation */}
      <div className="border-b border-gray-700 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center text-gray-300 text-sm">
            <Link href="/contests" className="hover:text-blue-400">
              All Contests
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-400">{contest.title}</span>
          </div>
        </div>
      </div>

      {/* Contest Title Header with Time Left */}
      <div className="bg-[#121B38] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{contest.title}</h1>
              <div className="text-blue-400 text-sm mt-1">
                Contest #{contestId}
              </div>
            </div>
            <div className="mt-2 md:mt-0 flex items-center">
              <span className="text-sm text-gray-300 mr-2">Time Left:</span>
              <span className="font-mono text-green-400 font-bold">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Aligned with max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Challenges Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-white">Challenges</h2>
          <div className="text-sm text-gray-400">
            Current Rank: <span className="text-white font-medium">N/A</span>
          </div>
        </div>
        
        {/* Contest Info and Challenge Table Row */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Challenges Table - Now takes up more space */}
          <div className="w-full lg:w-3/4">
            {contest.problems && contest.problems.length > 0 ? (
              <div className="bg-[#121B38] border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#121B38] text-gray-300">
                    <tr>
                      <th className="py-4 px-4 text-left font-medium w-1/4">Title</th>
                      <th className="py-4 px-4 text-left font-medium w-1/6">Difficulty</th>
                      <th className="py-4 px-4 text-left font-medium w-1/4">Tags</th>
                      <th className="py-4 px-4 text-left font-medium w-1/6">Time/Memory</th>
                      <th className="py-4 px-4 text-right font-medium w-1/6">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contest.problems.map((problem, index) => (
                      <tr 
                        key={problem._id} 
                        className="border-t border-gray-700 hover:bg-[#1a2540]"
                      >
                        <td className="py-4 px-4 font-medium text-white">
                          {String.fromCharCode(65 + index)}. {problem.title || "Unnamed Problem"}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty ? 
                              problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) : 
                              "Unknown"
                            }
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {problem.tags && problem.tags.length > 0 ? (
                              problem.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="bg-[#0f172a] text-blue-400 text-xs px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">No tags</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {problem.timeLimit || 1}ms / {problem.memoryLimit || 256}MB
                        </td>
                        <td className="py-4 px-4">
                          {solvedProblems.has(problem._id) ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="bg-green-600 text-white px-3 py-1.5 text-sm rounded font-medium inline-flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Solved
                              </span>
                              <button
                                onClick={() => router.push(`/contest/editor/${contestId}/${problem._id}`)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 text-sm rounded font-medium transition-colors whitespace-nowrap"
                              >
                                View Solution
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <button
                                onClick={() => router.push(`/contest/editor/${contestId}/${problem._id}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded font-medium transition-colors whitespace-nowrap"
                              >
                                Solve Challenge
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-[#121B38] border border-gray-700 rounded-md">
                <p className="text-gray-400">There are no problems available for this contest.</p>
              </div>
            )}
          </div>
          
          {/* Contest Info & Links - Now smaller for better proportions */}
          <div className="w-full lg:w-1/4">
            <div className="bg-[#121B38] border border-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-xl mb-4">Contest ends in {timeLeft}</h2>
              
              <ul className="space-y-3 mt-4">
                <li>
                  <Link 
                    href={`/contest/${contestId}/leaderboard`} 
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <Trophy size={18} />
                    <span>Current Leaderboard</span>
                  </Link>
                </li>
                {/* <li>
                  <Link 
                    href={`/contest/${contestId}/progress`} 
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <BarChart2 size={18} />
                    <span>Compare Progress</span>
                  </Link>
                </li> */}
                <li>
                  <Link 
                    href={`/contest/${contestId}/submissions`} 
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <FileText size={18} />
                    <span>Review Submissions</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartContestPage;