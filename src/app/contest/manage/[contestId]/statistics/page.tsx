"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Trophy, 
  Code, 
  TrendingUp, 
  Award, 
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContestStats {
  totalParticipants: number;
  totalSubmissions: number;
  totalProblems: number;
  averageScore: number;
  completionRate: number;
  activeParticipants: number;
  successfulSubmissions: number;
  failedSubmissions: number;
  mostAttemptedProblem?: {
    title: string;
    attempts: number;
  };
  topPerformer?: {
    username: string;
    score: number;
  };
  submissionsByLanguage: {
    language: string;
    count: number;
  }[];
  submissionsByStatus: {
    status: string;
    count: number;
  }[];
  problemStats: {
    problemId: string;
    title: string;
    totalSubmissions: number;
    successRate: number;
    averageScore: number;
  }[];
}

export default function StatisticsPage() {
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ContestStats | null>(null);
  const [contest, setContest] = useState<any>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // Fetch contest details
        const contestRes = await fetch(`/api/contest/getContestById/${contestId}`);
        const contestData = await contestRes.json();
        
        if (contestData.success) {
          setContest(contestData.data);
        }
        
        // Fetch all submissions
        const submissionsRes = await fetch(`/api/contest/all-submissions/${contestId}`);
        const submissionsData = await submissionsRes.json();
        
        // Fetch participants
        const participantsRes = await fetch(`/api/contest/participants/${contestId}`);
        const participantsData = await participantsRes.json();
        
        // Fetch leaderboard for accurate scores
        const leaderboardRes = await fetch(`/api/contest/leaderboard/${contestId}`);
        const leaderboardData = await leaderboardRes.json();
        
        if (submissionsData.success && participantsData.success) {
          const submissions = submissionsData.data || [];
          const participants = participantsData.participants || [];
          const leaderboard = leaderboardData.success ? leaderboardData.data : [];
          
          // Calculate statistics
          const calculatedStats = calculateStatistics(submissions, participants, contestData.data, leaderboard);
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    
    if (contestId) {
      fetchStatistics();
    }
  }, [contestId]);

  const calculateStatistics = (submissions: any[], participants: any[], contestData: any, leaderboard: any[]): ContestStats => {
    const totalParticipants = participants.length;
    const totalSubmissions = submissions.length;
    const totalProblems = contestData?.problems?.length || 0;
    
    // Calculate success/failed submissions
    const successfulSubmissions = submissions.filter(s => 
      s.status?.toLowerCase() === 'correct' || s.status?.toLowerCase() === 'accepted'
    ).length;
    const failedSubmissions = totalSubmissions - successfulSubmissions;
    
    // Calculate average score
    const totalScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0);
    const averageScore = totalSubmissions > 0 ? Math.round(totalScore / totalSubmissions) : 0;
    
    // Calculate completion rate (participants who made at least one submission)
    const uniqueSubmitters = new Set(submissions.map(s => s.userId?._id)).size;
    const completionRate = totalParticipants > 0 ? Math.round((uniqueSubmitters / totalParticipants) * 100) : 0;
    
    // Submissions by language
    const languageCounts: { [key: string]: number } = {};
    submissions.forEach(s => {
      const lang = s.languageUsed || 'Unknown';
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });
    const submissionsByLanguage = Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
    
    // Submissions by status
    const statusCounts: { [key: string]: number } = {};
    submissions.forEach(s => {
      const status = s.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const submissionsByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
    
    // Problem statistics
    const problemSubmissions: { [key: string]: any[] } = {};
    submissions.forEach(s => {
      const problemId = s.problemId?._id;
      if (problemId) {
        if (!problemSubmissions[problemId]) {
          problemSubmissions[problemId] = [];
        }
        problemSubmissions[problemId].push(s);
      }
    });
    
    const problemStats = Object.entries(problemSubmissions).map(([problemId, subs]) => {
      const successful = subs.filter(s => 
        s.status?.toLowerCase() === 'correct' || s.status?.toLowerCase() === 'accepted'
      ).length;
      const totalScore = subs.reduce((sum, s) => sum + (s.score || 0), 0);
      
      return {
        problemId,
        title: subs[0]?.problemId?.title || 'Unknown',
        totalSubmissions: subs.length,
        successRate: Math.round((successful / subs.length) * 100),
        averageScore: Math.round(totalScore / subs.length)
      };
    }).sort((a, b) => b.totalSubmissions - a.totalSubmissions);
    
    // Most attempted problem
    const mostAttemptedProblem = problemStats.length > 0 ? {
      title: problemStats[0].title,
      attempts: problemStats[0].totalSubmissions
    } : undefined;
    
    // Top performer (from leaderboard with actual real-time scores)
    const topPerformer = leaderboard.length > 0 && leaderboard[0] ? {
      username: leaderboard[0].username || 'N/A',
      score: leaderboard[0].score || 0
    } : undefined;
    
    return {
      totalParticipants,
      totalSubmissions,
      totalProblems,
      averageScore,
      completionRate,
      activeParticipants: uniqueSubmitters,
      successfulSubmissions,
      failedSubmissions,
      mostAttemptedProblem,
      topPerformer,
      submissionsByLanguage,
      submissionsByStatus,
      problemStats
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-white mb-2">Contest Statistics</h1>
            <p className="text-gray-400 mb-8">
              {contest?.title || 'Contest'} - Overview and analytics
            </p>
          </div>
          <Link 
            href={`/contest/${contestId}/leaderboard`}
            className="px-4 py-2 bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 rounded-md flex items-center gap-2 h-fit"
          >
            <Trophy size={16} /> View Leaderboard
          </Link>
        </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Participants</p>
              <p className="text-3xl font-bold text-white">{stats?.totalParticipants || 0}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-white">{stats?.totalSubmissions || 0}</p>
            </div>
            <Code className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-white">{stats?.averageScore || 0}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-white">{stats?.completionRate || 0}%</p>
            </div>
            <Award className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Submission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-white">Successful</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">{stats?.successfulSubmissions || 0}</p>
          <p className="text-sm text-gray-400 mt-1">Accepted solutions</p>
        </div>

        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-white">Failed</h3>
          </div>
          <p className="text-3xl font-bold text-red-500">{stats?.failedSubmissions || 0}</p>
          <p className="text-sm text-gray-400 mt-1">Rejected solutions</p>
        </div>

        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-blue-500">{stats?.activeParticipants || 0}</p>
          <p className="text-sm text-gray-400 mt-1">Made submissions</p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats?.topPerformer && (
          <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-white">Top Performer</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">{stats.topPerformer.username}</p>
              <p className="text-gray-400">Score: <span className="text-green-500 font-semibold">{stats.topPerformer.score}</span></p>
            </div>
          </div>
        )}

        {stats?.mostAttemptedProblem && (
          <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">Most Attempted</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">{stats.mostAttemptedProblem.title}</p>
              <p className="text-gray-400">Attempts: <span className="text-blue-500 font-semibold">{stats.mostAttemptedProblem.attempts}</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Language Distribution */}
      {stats?.submissionsByLanguage && stats.submissionsByLanguage.length > 0 && (
        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-white">Submissions by Language</h3>
          </div>
          <div className="space-y-4">
            {stats.submissionsByLanguage.map((item) => {
              const percentage = Math.round((item.count / (stats?.totalSubmissions || 1)) * 100);
              return (
                <div key={item.language}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium capitalize">{item.language}</span>
                    <span className="text-gray-400">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Problem Statistics */}
      {stats?.problemStats && stats.problemStats.length > 0 && (
        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold text-white">Problem Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Problem</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Submissions</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Success Rate</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {stats.problemStats.map((problem) => (
                  <tr key={problem.problemId} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                    <td className="py-3 px-4 text-white">{problem.title}</td>
                    <td className="py-3 px-4 text-gray-300">{problem.totalSubmissions}</td>
                    <td className="py-3 px-4">
                      <span className={`${
                        problem.successRate >= 70 ? 'text-green-500' :
                        problem.successRate >= 40 ? 'text-yellow-500' :
                        'text-red-500'
                      } font-semibold`}>
                        {problem.successRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{problem.averageScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}