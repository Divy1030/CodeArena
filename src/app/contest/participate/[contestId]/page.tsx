'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/dashboard/button";
import { toast } from 'react-hot-toast';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatDistanceToNow } from 'date-fns';

// Define more specific types for test cases
interface TestCase {
  input: string;
  output: string;
  explanation?: string;
  isHidden?: boolean;
}

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  statement?: string;
  testCases?: TestCase[]; // Replace any[] with TestCase[]
}

interface ContestData {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  problems: Problem[];
  isRated: boolean;
  rules?: string;
}

// Define the shape of problem data from API
interface ApiProblem {
  _id: string;
  title: string;
  difficulty?: string;
  statement?: string;
  testCases?: TestCase[];
  [key: string]: unknown; // For any other properties
}

const ContestParticipationPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [contestData, setContestData] = useState<ContestData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  // Use the start-contest API to get contest with problems
  useEffect(() => {
    const startContest = async () => {
      try {
        setLoading(true);
        
        // Call start-contest API
        const response = await fetch(`/api/contest/start-contest/${contestId}`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to start contest');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          // API returns array with one contest object
          const contestData = Array.isArray(result.data) ? result.data[0] : result.data;
          
          setContestData({
            _id: contestData._id,
            title: contestData.title,
            description: contestData.description,
            startTime: contestData.startTime,
            endTime: contestData.endTime,
            duration: contestData.duration,
            problems: contestData.problems?.map((problem: ApiProblem) => ({
              _id: problem._id,
              title: problem.title,
              difficulty: problem.difficulty || 'Medium',
              statement: problem.statement,
              testCases: problem.testCases
            })) || [],
            isRated: contestData.isRated,
            rules: contestData.rules
          });
          
          // Calculate time remaining
          const endTime = new Date(contestData.endTime);
          const now = new Date();
          
          if (now > endTime) {
            toast.error("Contest has ended");
            router.push(`/contest/details/${contestId}`);
            return;
          }
          
          // Initialize time remaining
          setTimeRemaining(formatDistanceToNow(endTime, { addSuffix: false }));
          
        } else {
          throw new Error('Invalid response format or missing data');
        }
      } catch (error) {
        console.error('Error starting contest:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        toast.error("Failed to load contest problems");
      } finally {
        setLoading(false);
      }
    };
    
    if (contestId) {
      startContest();
    }
  }, [contestId, router]);
  
  // Update time remaining
  useEffect(() => {
    if (!contestData) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const endTime = new Date(contestData.endTime);
      
      if (now >= endTime) {
        clearInterval(timer);
        toast.error("Contest has ended");
        router.push(`/contest/results/${contestId}`);
        return;
      }
      
      setTimeRemaining(formatDistanceToNow(endTime, { addSuffix: false }));
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, [contestData, contestId, router]);
  
  const handleSolveProblem = (problem: Problem): void => {
    // Encode problem data to safely pass as URL parameters
    const problemData = encodeURIComponent(JSON.stringify({
      id: problem._id,
      title: problem.title,
      difficulty: problem.difficulty,
      statement: problem.statement,
      testCases: problem.testCases || []
    }));
    
    router.push(`/contest/editor?contestId=${contestId}&problemData=${problemData}`);
  };

  // Handle submission of the entire contest
  const handleSubmitContest = () => {
    toast.success(`Contest ${contestId} submitted successfully!`);
    router.push(`/contest/results/${contestId}`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mr-3"></div>
          <div className="text-white text-xl">
            Loading contest...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !contestData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0f172a] text-white p-8">
          <div className="max-w-4xl mx-auto bg-red-900/20 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-bold flex items-center">
              <span role="img" aria-label="warning" className="mr-2">⚠️</span> Error
            </h2>
            <p className="mt-2">{error || "Failed to load contest"}</p>
            <Button 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/user/home')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f172a] text-white">
        {/* Contest Header */}
        <div className="bg-[#1e293b] py-6 px-6 sticky top-0 z-10 border-b border-gray-700">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{contestData.title}</h1>
              <p className="text-gray-300 text-sm mt-1">
                {contestData.problems.length} problems
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-red-900/30 px-4 py-2 rounded-md border border-red-700/50">
                <span className="text-white font-medium">Time Remaining:</span>
                <span className="ml-2 text-red-400 font-mono font-bold">{timeRemaining}</span>
              </div>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmitContest}
              >
                Submit All Solutions
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Problems List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Problems</h2>
            
            <div className="grid gap-4">
              {contestData.problems && contestData.problems.length > 0 ? (
                contestData.problems.map((problem, index) => (
                  <div 
                    key={problem._id} 
                    className="bg-[#1e293b] rounded-lg p-4 hover:bg-[#1e293b]/90 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">
                          {String.fromCharCode(65 + index)}. {problem.title}
                        </h3>
                        <span className={`text-xs rounded px-2 py-0.5 mt-1 inline-block ${
                          problem.difficulty?.toLowerCase() === 'easy' ? 'bg-green-500 text-white' :
                          problem.difficulty?.toLowerCase() === 'hard' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-black'
                        }`}>
                          {problem.difficulty || 'Medium'}
                        </span>
                      </div>
                      
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleSolveProblem(problem)}
                      >
                        Solve
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-[#1e293b] rounded-lg">
                  <p className="text-gray-400">No problems found in this contest.</p>
                </div>
              )}
            </div>
          </div>

          {/* Contest Rules */}
          {contestData.rules && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Contest Rules</h2>
              <div className="bg-[#1e293b] rounded-lg p-6 whitespace-pre-line">
                {contestData.rules}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ContestParticipationPage;