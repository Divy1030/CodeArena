"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setIsMobile, setIsTablet, setActiveView, setCode } from '@/store/slices/editorSlice';
import { updateTestCases } from '@/store/slices/problemSlice';
import toast from 'react-hot-toast';
import endpoints from '@/libs/api';

// Components
import EditorToolbar from '@/components/editor/EditorToolbar';
import SettingsModal from '@/components/editor/SettingsModal';
import TestResults from '@/components/editor/TestResults';
import CodeEditorComponent from '@/components/editor/CodeEditorComponent';

interface TestCase {
  input: string;
  output: string;
  explanation: string;
  _id: string;
}

interface Problem {
  _id: string;
  title: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdBy: string;
  tags: string[];
  testCases: TestCase[];
  timeLimit: number;
  memoryLimit: number;
  maxScore: number;
  isSolved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Problem Display Component for standalone problems
const StandaloneProblemDisplay: React.FC<{ problem: Problem }> = ({ problem }) => {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-900 text-white">
      {/* Problem Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold mb-2">{problem.title}</h1>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs border capitalize ${getDifficultyBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className="text-gray-400 text-sm">Max Score: {problem.maxScore || 0}</span>
          <span className="text-gray-400 text-sm">Time: {problem.timeLimit}s</span>
          <span className="text-gray-400 text-sm">Memory: {problem.memoryLimit} MB</span>
        </div>
        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {problem.tags.map(tag => (
              <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Problem Content */}
      <div className="p-4 space-y-6">
        {/* Problem Statement */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Problem Statement</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{problem.statement}</p>
        </div>

        {/* Input Format */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Input Format</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{problem.inputFormat}</p>
        </div>

        {/* Output Format */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Output Format</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{problem.outputFormat}</p>
        </div>

        {/* Constraints */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Constraints</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{problem.constraints}</p>
        </div>

        {/* Sample Input/Output */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Sample Input</h2>
          <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm text-gray-300 whitespace-pre-wrap">
            {problem.sampleInput}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Sample Output</h2>
          <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm text-gray-300 whitespace-pre-wrap">
            {problem.sampleOutput}
          </div>
        </div>

        {/* Explanation */}
        {problem.explanation && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Explanation</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{problem.explanation}</p>
          </div>
        )}

        {/* Test Cases Preview */}
        {problem.testCases && problem.testCases.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Cases</h2>
            <div className="space-y-3">
              {problem.testCases.slice(0, 2).map((testCase, index) => (
                <div key={testCase._id} className="bg-gray-800 rounded-lg p-3">
                  <div className="text-gray-400 text-sm mb-2">Test Case {index + 1}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Input</div>
                      <div className="font-mono text-gray-300 text-sm">{testCase.input}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Expected Output</div>
                      <div className="font-mono text-gray-300 text-sm">{testCase.output}</div>
                    </div>
                  </div>
                </div>
              ))}
              {problem.testCases.length > 2 && (
                <div className="text-gray-500 text-sm text-center">
                  +{problem.testCases.length - 2} more test cases
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProblemEditorPage: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const problemId = params?.problemId as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isFullScreen, activeView, isMobile } = useAppSelector(state => state.editor);
  const { executionResult, isSubmitting } = useAppSelector(state => state.execution);

  // Initialize responsive state
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth <= 768));
      dispatch(setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch(endpoints.problem.getProblemById(problemId), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch problem');
        }

        const foundProblem = data.data;
        
        if (!foundProblem) {
          throw new Error('Problem not found');
        }

        setProblem(foundProblem);
        
        // Initialize test cases for the editor
        if (foundProblem.testCases && foundProblem.testCases.length > 0) {
          const formattedTestCases = foundProblem.testCases.map((tc: TestCase, index: number) => ({
            id: index + 1,
            input: tc.input,
            expectedOutput: tc.output,
            actualOutput: '',
            status: 'pending' as const
          }));
          dispatch(updateTestCases(formattedTestCases));
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  // Handle submission success
  useEffect(() => {
    if (isSubmitting === false && executionResult?.passed === executionResult?.total && executionResult?.total !== null) {
      toast.success('Congratulations! All test cases passed!');
    }
  }, [isSubmitting, executionResult?.passed, executionResult?.total]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error || 'Problem not found'}</div>
          <button 
            onClick={() => window.location.href = '/problems'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="flex justify-around items-center p-4 bg-gray-900">
          <button
            className={`text-white ${activeView === 'problem' ? 'font-bold' : ''}`}
            onClick={() => dispatch(setActiveView('problem'))}
          >
            Problem
          </button>
          <button
            className={`text-white ${activeView === 'ide' ? 'font-bold' : ''}`}
            onClick={() => dispatch(setActiveView('ide'))}
          >
            IDE
          </button>
        </nav>
      )}

      <div className="flex h-full overflow-hidden bg-gray-800">
        {/* Problem Section */}
        {!isFullScreen && (!isMobile || activeView === 'problem') && (
          <div className={`${isMobile ? 'w-full' : 'w-1/2'} overflow-auto h-screen`}>
            <StandaloneProblemDisplay problem={problem} />
          </div>
        )}

        {/* Editor Section */}
        {(!isMobile || activeView === 'ide') && (
          <div className={`p-4 ${isMobile || isFullScreen ? 'w-full' : 'w-1/2'} overflow-auto h-screen`}>
            <EditorToolbar problemId={problemId} isStandalone={true} />
            <SettingsModal />
            <CodeEditorComponent />
            <TestResults />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemEditorPage;
