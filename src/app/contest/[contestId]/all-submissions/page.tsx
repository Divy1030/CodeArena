"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { toast } from 'react-hot-toast';

interface Submission {
  _id: string;
  userId?: {
    _id: string;
    username: string;
    email?: string;
  };
  problemId: {
    _id: string;
    title: string;
    difficulty?: string;
  };
  contestId?: string;
  solutionCode: string;
  languageUsed: string;
  status: string;
  score?: number;
  maxScore?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  timeOccupied?: number | null;
  memoryOccupied?: number | null;
  submittedAt: string;
  error?: string;
}

interface ContestData {
  _id: string;
  title: string;
}

export default function AllSubmissionsPage() {
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [contest, setContest] = useState<ContestData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch contest details
        const contestRes = await fetch(`/api/contest/getContestById/${contestId}`);
        const contestData = await contestRes.json();
        
        if (contestData.success) {
          setContest(contestData.data);
        }
        
        // Fetch all submissions for this contest
        const submissionsRes = await fetch(`/api/contest/user-submissions/${contestId}`);
        const submissionsData = await submissionsRes.json();
        
        if (submissionsData.success) {
          setSubmissions(submissionsData.data || []);
        } else {
          toast.error('Failed to load submissions');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading submissions');
      } finally {
        setLoading(false);
      }
    };
    
    if (contestId) {
      fetchData();
    }
  }, [contestId]);

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase() || '';
    if (lowerStatus === 'correct' || lowerStatus === 'accepted') {
      return 'text-green-500 bg-green-900/30 border-green-700';
    }
    if (lowerStatus === 'wrong_answer' || lowerStatus === 'incorrect') {
      return 'text-red-500 bg-red-900/30 border-red-700';
    }
    if (lowerStatus.includes('time_limit') || lowerStatus.includes('memory_limit')) {
      return 'text-yellow-500 bg-yellow-900/30 border-yellow-700';
    }
    if (lowerStatus.includes('runtime_error') || lowerStatus.includes('compilation_error')) {
      return 'text-orange-500 bg-orange-900/30 border-orange-700';
    }
    if (lowerStatus === 'pending') {
      return 'text-blue-500 bg-blue-900/30 border-blue-700';
    }
    return 'text-gray-500 bg-gray-700/30 border-gray-600';
  };

  const getStatusIcon = (status: string) => {
    const lowerStatus = status?.toLowerCase() || '';
    if (lowerStatus === 'correct' || lowerStatus === 'accepted') {
      return <CheckCircle className="w-4 h-4" />;
    }
    if (lowerStatus === 'pending') {
      return <Clock className="w-4 h-4" />;
    }
    return <XCircle className="w-4 h-4" />;
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <Link 
            href={`/contest/${contestId}/preview-challenges`}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contest
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {contest ? `${contest.title} - All Submissions` : 'Contest Submissions'}
            </h1>
            <p className="text-gray-400">View all submissions made in this contest</p>
          </div>

          {/* Submissions Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-[#121B38] border border-gray-700 rounded-lg p-12 text-center">
              <p className="text-gray-400 text-lg">No submissions yet</p>
            </div>
          ) : (
            <div className="bg-[#121B38] border border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#0f172a]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Problem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#121B38] divide-y divide-gray-700">
                    {submissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-[#1a2540]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-white">
                              {submission.userId?.username || 'Unknown User'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {submission.problemId?.title || 'Unknown Problem'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded bg-[#0f172a] text-blue-400">
                            {submission.languageUsed}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            {formatStatus(submission.status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {submission.score !== undefined ? `${submission.score}` : '-'}
                          {submission.testCasesPassed !== undefined && submission.totalTestCases !== undefined && (
                            <span className="text-gray-500 text-xs ml-1">
                              ({submission.testCasesPassed}/{submission.totalTestCases})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {submission.timeOccupied ? `${submission.timeOccupied}ms` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(submission.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => viewSubmission(submission)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submission Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121B38] border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0f172a] border-b border-gray-700 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Submission Details</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedSubmission.userId?.username} - {selectedSubmission.problemId?.title}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Submission Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    {formatStatus(selectedSubmission.status)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Language</p>
                  <p className="text-sm text-white">{selectedSubmission.languageUsed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Score</p>
                  <p className="text-sm text-white">
                    {selectedSubmission.score !== undefined ? selectedSubmission.score : 'N/A'}
                  </p>
                </div>
                {selectedSubmission.testCasesPassed !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Test Cases</p>
                    <p className="text-sm text-white">
                      {selectedSubmission.testCasesPassed}/{selectedSubmission.totalTestCases}
                    </p>
                  </div>
                )}
                {selectedSubmission.timeOccupied && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Execution Time</p>
                    <p className="text-sm text-white">{selectedSubmission.timeOccupied}ms</p>
                  </div>
                )}
                {selectedSubmission.memoryOccupied && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Memory Used</p>
                    <p className="text-sm text-white">{selectedSubmission.memoryOccupied}MB</p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {selectedSubmission.error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <p className="text-xs text-red-400 font-medium mb-2">Error</p>
                  <pre className="text-sm text-red-300 whitespace-pre-wrap">{selectedSubmission.error}</pre>
                </div>
              )}

              {/* Code */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Submitted Code</p>
                <div className="bg-[#0f172a] border border-gray-700 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono">{selectedSubmission.solutionCode}</pre>
                </div>
              </div>

              {/* Submitted At */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Submitted At</p>
                <p className="text-sm text-white">{formatDate(selectedSubmission.submittedAt)}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-[#0f172a] border-t border-gray-700 px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
