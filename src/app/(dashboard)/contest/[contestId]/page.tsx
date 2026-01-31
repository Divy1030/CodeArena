'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Trophy, CheckCircle, Code, Award } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  maxScore: number;
  tags?: string[];
}

interface Contest {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  participants?: any[];
  organizer?: {
    username: string;
  };
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params?.contestId as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);

  useEffect(() => {
    if (contestId) {
      fetchContestDetails();
      checkSolvedProblems();
    }

    // Listen for user data updates (when problems are solved)
    const handleUserDataUpdate = () => {
      checkSolvedProblems();
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUserDataUpdate);
  }, [contestId]);

  const fetchContestDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      console.log('🔍 Fetching contest details for:', contestId);
      const response = await fetch(`/api/contest/getContestById/${contestId}`);

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contest details (${response.status})`);
      }
      
      const result = await response.json();
      console.log('📦 Response data:', result);
      
      if (result.success) {
        setContest(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch contest details');
        console.error('❌ Error:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching contest:', error);
      toast.error('Error loading contest');
    } finally {
      setLoading(false);
    }
  };

  const checkSolvedProblems = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        const solved = (parsed.solvedProblems || []).map((sp: any) => 
          typeof sp === 'string' ? sp : sp.problemId || sp._id
        );
        setSolvedProblems(solved);
      }
    } catch (error) {
      console.error('Error checking solved problems:', error);
    }
  };

  const isProblemSolved = (problemId: string) => {
    return solvedProblems.includes(problemId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleSolveProblem = (problemId: string) => {
    // Set sessionStorage to hide back button when navigating from contest page
    sessionStorage.setItem('practiceModeSource', 'contest');
    router.push(`/problems/solve/${contestId}/${problemId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1437] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-[#0B1437] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Contest not found</h2>
          <button
            onClick={() => router.push('/contests')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  const isPastContest = new Date() > new Date(contest.endTime);

  return (
    <div className="min-h-screen bg-[#0B1437] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push('/contests')}
            className="flex items-center text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Contests
          </button>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">{contest.title}</h1>
            {contest.description && (
              <p className="text-gray-300 text-lg mb-4">{contest.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(contest.startTime), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {format(new Date(contest.startTime), 'HH:mm')} - {format(new Date(contest.endTime), 'HH:mm')}
              </div>
              {contest.participants && (
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  {contest.participants.length} participants
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Problems</h2>
          <p className="text-gray-400">
            {isPastContest 
              ? 'Practice with these problems. Your rating will be updated on first solve.' 
              : 'Contest problems will be available during the contest period.'}
          </p>
        </div>

        {contest.problems && contest.problems.length > 0 ? (
          <div className="space-y-4">
            {contest.problems.map((problem, index) => {
              const isSolved = isProblemSolved(problem._id);
              
              return (
                <div
                  key={problem._id}
                  className="bg-[#1a2332] border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-500 font-mono">#{index + 1}</span>
                        <h3 className="text-xl font-semibold text-white">{problem.title}</h3>
                        {isSolved && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Solved
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-gray-400">
                          <Trophy className="w-4 h-4 inline mr-1" />
                          {problem.maxScore} points
                        </span>
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="flex gap-2">
                            {problem.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSolveProblem(problem._id)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        isSolved
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Code className="w-4 h-4" />
                      {isSolved ? 'View Solution' : 'Solve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#1a2332] rounded-xl border border-gray-700/50">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No problems available</h3>
            <p className="text-gray-500">Problems will be added to this contest soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
