'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import QuestionRow from '@/components/contest/QuestionRow';

// Define interfaces for the data structures
interface Question {
  id: number;
  title: string;
  type: string;
  description?: string;
}

interface ContestData {
  id: string;
  title: string;
  description: string;
  timeRemaining: string;
  questions: Question[];
}

// Component that uses useSearchParams
function ContestProblemContent() {
  // Keep activeQuestion state as it's used in handleSolve
  const [, setActiveQuestion] = useState<number>(1);
  const [contestData, setContestData] = useState<ContestData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Get the contest ID from the URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const contestId = searchParams.get('id') || 'contest-123'; // Default ID if none provided

  // Simulate fetching contest data based on the ID
  useEffect(() => {
    // This would be an API call in a real application
    const fetchContestData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo data based on contest ID
      const data: ContestData = {
        id: contestId,
        title: contestId === 'contest-123' ? 'Algorithm Challenge' : 
               contestId === 'contest-120' ? 'Data Structures Showdown' : 
               contestId === 'contest-121' ? 'Dynamic Programming Marathon' : 
               'Graph Theory Challenge',
        description: 'Complete all questions within the given time to earn points and improve your ranking.',
        timeRemaining: '01:45:30', // HH:MM:SS
        questions: [
          { 
            id: 1, 
            title: 'Valid Palindrome', 
            type: 'Code',
            description: 'Check if a string is a valid palindrome, considering only alphanumeric characters and ignoring cases.'
          },
          { 
            id: 2, 
            title: 'Country Populations', 
            type: 'Approximate Solution' 
          },
          { 
            id: 3, 
            title: 'Good URI Design', 
            type: 'Multiple Choice' 
          },
          { 
            id: 4, 
            title: 'REST Server Response', 
            type: 'Multiple Choice' 
          }
        ]
      };
      
      setContestData(data);
      setLoading(false);
    };
    
    fetchContestData();
  }, [contestId]);

  const questions: Question[] = contestData?.questions || [
    { 
      id: 1, 
      title: 'Valid Palindrome', 
      type: 'Code',
      description: 'Check if a string is a valid palindrome, considering only alphanumeric characters and ignoring cases.' 
    },
    { id: 2, title: 'Country Populations', type: 'Approximate Solution' },
    { id: 3, title: 'Good URI Design', type: 'Multiple Choice' },
    { id: 4, title: 'REST Server Response', type: 'Multiple Choice' }
  ];

  const handleSolve = (question: Question): void => {
    setActiveQuestion(question.id);
    
    // For demo, only navigate to editor for Code type questions
    if (question.type === 'Code') {
      // Navigate to the editor page with both contestId and questionId
      router.push(`/contest/editor?contestId=${contestId}&questionId=${question.id}`);
    } else {
      // For non-code questions (Multiple Choice, etc.), show an alert for demo
      alert(`This is a ${question.type} question. The editor is only for Code questions in this demo.`);
    }
  };

  // Handle submission of the entire contest
  const handleSubmitContest = () => {
    // In a real app, this would submit all answers and redirect to results
    alert(`Contest ${contestId} submitted successfully! (Demo)`);
    // Could redirect to results page
    // router.push(`/contest/results?id=${contestId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Loading contest {contestId}...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* <SideNavigation activeItem={activeQuestion} /> */}
      
      <main className="flex-1 pl-16 min-h-screen">
        <div className="max-w-8xl mx-auto p-6 mt-14">
          {/* Contest Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">{contestData?.title}</h1>
            <p className="text-gray-400 mt-2">{contestData?.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-blue-400">Contest ID: {contestId}</div>
              <div className="bg-gray-800 px-4 py-2 rounded-md">
                <span className="text-white font-medium">Time Remaining: </span>
                <span className="text-red-400 font-medium">{contestData?.timeRemaining}</span>
              </div>
            </div>
          </div>

          {/* Questions Table */}
          <div className="bg-gray-700 overflow-hidden shadow-lg">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-800 p-4 text-gray-200">
              <div className="col-span-7 font-medium">QUESTIONS</div>
              <div className="col-span-3 font-medium">TYPE</div>
              <div className="col-span-2 font-medium">ACTION</div>
            </div>

            {/* Questions List */}
            <div className="divide-y divide-gray-700 bg-gray-900">
              {questions.map((question) => (
                <QuestionRow 
                  key={question.id} 
                  question={question}
                  onSolve={handleSolve}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button 
              className="bg-gray-900 text-white px-6 py-2 border border-white hover:bg-blue-500 transition-colors w-60"
              onClick={handleSubmitContest}
            >
              Submit Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <div className="text-white text-xl">Loading contest...</div>
      </div>
    </div>
  );
}

// Main page component wrapped in Suspense
const ContestProblemPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContestProblemContent />
    </Suspense>
  );
};

export default ContestProblemPage;