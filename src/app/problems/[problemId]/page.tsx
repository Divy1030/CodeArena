'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import endpoints from '@/libs/api';

interface TestCase {
  input: string;
  output: string;
  explanation: string;
  _id: string;
}

interface Submission {
  _id: string;
  score: number;
  solutionCode: string;
  languageUsed: string;
  timeOccupied: number;
  memoryOccupied: number;
  submittedAt: string;
  createdAt: string;
  status?: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error';
  testCases?: Array<{ input: string; output: string; passed: boolean }>;
}

interface Solution {
  _id: string;
  score: number;
  solutionCode: string;
  languageUsed: string;
  timeOccupied: number;
  memoryOccupied: number;
  testCases?: Array<{ input: string; output: string; passed: boolean }>;
  createdAt: string;
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
  score?: number;
  createdAt: string;
  updatedAt: string;
  // Solution attached to the problem (official/reference solution)
  solution?: Solution;
}

const ProblemDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId as string;
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userSolution, setUserSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'solutions' | 'submissions'>('description');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch problem by ID directly
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

        const responseData = data.data;
        
        if (!responseData || !responseData.problem) {
          throw new Error('Problem not found');
        }

        setProblem(responseData.problem);
        setUserSolution(responseData.userSolution || null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId, router]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121B38] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading problem...</div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[#121B38] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error || 'Problem not found'}</div>
          <button 
            onClick={() => router.push('/problems')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121B38]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/problems')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Problems
        </button>

        {/* Problem Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{problem.title}</h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm border capitalize ${getDifficultyBadge(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                {problem.isSolved && (
                  <span className="flex items-center gap-1 text-green-500 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Solved
                  </span>
                )}
                {problem.score !== undefined && problem.score > 0 && (
                  <span className="text-blue-400 text-sm">
                    Your Score: {problem.score}/{problem.maxScore || 0}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm">Max Score: <span className="text-white font-medium">{problem.maxScore || 0}</span></div>
              <div className="text-gray-400 text-sm mt-1">Time Limit: <span className="text-white">{problem.timeLimit}s</span></div>
              <div className="text-gray-400 text-sm">Memory: <span className="text-white">{problem.memoryLimit} MB</span></div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {problem.tags?.map(tag => (
              <span
                key={tag}
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'description'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'solutions'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Solutions
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'submissions'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Submissions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Problem Statement */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">Problem Statement</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{problem.statement}</p>
            </div>

            {/* Input Format */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">Input Format</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{problem.inputFormat}</p>
            </div>

            {/* Output Format */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">Output Format</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{problem.outputFormat}</p>
            </div>

            {/* Constraints */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">Constraints</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{problem.constraints}</p>
            </div>

            {/* Sample Input/Output */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">Sample Input</h2>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-gray-300 whitespace-pre-wrap">
                {problem.sampleInput}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">Sample Output</h2>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-gray-300 whitespace-pre-wrap">
                {problem.sampleOutput}
              </div>
            </div>

            {/* Explanation */}
            {problem.explanation && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3">Explanation</h2>
                <p className="text-gray-300 whitespace-pre-wrap">{problem.explanation}</p>
              </div>
            )}

            {/* Test Cases Preview */}
            {problem.testCases && problem.testCases.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Test Cases</h2>
                <div className="space-y-4">
                  {problem.testCases.slice(0, 2).map((testCase, index) => (
                    <div key={testCase._id} className="bg-gray-900 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-2">Test Case {index + 1}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Input</div>
                          <div className="font-mono text-gray-300 text-sm">{testCase.input}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Expected Output</div>
                          <div className="font-mono text-gray-300 text-sm">{testCase.output}</div>
                        </div>
                      </div>
                      {testCase.explanation && (
                        <div className="mt-2">
                          <div className="text-gray-500 text-xs mb-1">Explanation</div>
                          <div className="text-gray-400 text-sm">{testCase.explanation}</div>
                        </div>
                      )}
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
        )}

        {activeTab === 'solutions' && (
          <div className="bg-gray-800 rounded-lg p-6">
            {problem.solution ? (
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">Reference Solution</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{problem.solution.languageUsed}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 text-sm">Score: {problem.solution.score}</span>
                      <span className="text-gray-400 text-sm">
                        Time: {problem.solution.timeOccupied}ms
                      </span>
                      <span className="text-gray-400 text-sm">
                        Memory: {problem.solution.memoryOccupied} MB
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(problem.solution.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <pre className="bg-gray-950 rounded p-3 text-sm text-gray-300 overflow-x-auto">
                    <code>{problem.solution.solutionCode}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">No solution available yet</p>
                <p className="text-sm text-gray-500 mt-1">A reference solution will be added soon</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-gray-800 rounded-lg p-6">
            {userSolution ? (
              <div className="space-y-4">
                {/* User's Latest Submission */}
                <h3 className="text-lg font-semibold text-white mb-4">Your Latest Submission</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userSolution.score === problem.maxScore 
                          ? 'bg-green-500/20 text-green-400' 
                          : userSolution.score > 0 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {userSolution.score === problem.maxScore ? 'Accepted' : userSolution.score > 0 ? 'Partially Correct' : 'Wrong Answer'}
                      </span>
                      <span className="text-gray-400 text-sm">{userSolution.languageUsed}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 text-sm">Score: {userSolution.score}/{problem.maxScore}</span>
                      <span className="text-gray-400 text-sm">Time: {userSolution.timeOccupied}ms</span>
                      <span className="text-gray-400 text-sm">Memory: {userSolution.memoryOccupied} MB</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(userSolution.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <pre className="bg-gray-950 rounded p-3 text-sm text-gray-300 overflow-x-auto">
                    <code>{userSolution.solutionCode}</code>
                  </pre>
                  
                  {/* Test Cases Results */}
                  {userSolution.testCases && userSolution.testCases.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Test Cases</h4>
                      <div className="flex flex-wrap gap-2">
                        {userSolution.testCases.map((tc, index) => (
                          <span 
                            key={index}
                            className={`px-2 py-1 rounded text-xs ${
                              tc.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            Test {index + 1}: {tc.passed ? 'Passed' : 'Failed'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No submissions yet</p>
                <p className="text-sm text-gray-500 mt-1">Submit your solution to see it here</p>
              </div>
            )}
          </div>
        )}

        {/* Solve Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              router.push(`/problems/${problemId}/solve`);
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Solve Problem
          </button>
        </div>

        {/* Problem Metadata */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Created: {new Date(problem.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
