import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/dashboard/Card';
import { Calendar, Clock, Tag, Trophy, Code2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

// Create interfaces for the data structures
interface User {
  _id: string;
  username?: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  contestsParticipated?: ContestParticipation[];
  solvedProblems?: SolvedProblem[];
}

interface ContestParticipation {
  contestId?: {
    _id: string;
    title: string;
  } | string;
  title?: string;
  joinedAt?: string;
  rank?: number | string;
  score?: number;
}

interface SolvedProblem {
  problemId?: {
    _id: string;
    title: string;
    difficulty?: string;
  } | string;
  title?: string;
  difficulty?: string;
  solvedAt?: string;
}

interface RecentSolution {
  problemId: string;
  contestId?: string;
  problemTitle: string;
  difficulty: string;
  solvedAt: string;
  score?: number;
  languageUsed?: string;
}

interface ProfileActivityProps {
  user: User;
}

const ProfileActivity: React.FC<ProfileActivityProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [recentSolutions, setRecentSolutions] = useState<RecentSolution[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch recent solutions with details
  useEffect(() => {
    const fetchRecentSolutions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.success && result.data?.recentSolvedProblems) {
          setRecentSolutions(result.data.recentSolvedProblems);
        }
      } catch (error) {
        console.error('Error fetching recent solutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSolutions();

    // Listen for user data updates
    const handleUpdate = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      }
      fetchRecentSolutions();
    };
    
    window.addEventListener('userDataUpdated', handleUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUpdate);
  }, []);

  // Update when prop changes
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };
  
  // Get last 5 contests the user participated in
  const recentContests = user.contestsParticipated?.slice(0, 5) || [];
  // Get last 5 problems the user solved
  const recentProblems = user.solvedProblems?.slice(0, 5) || [];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Recent Activity</h2>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Recent Contests
            </h3>
            {recentContests.length > 0 ? (
              <div className="space-y-4">
                {recentContests.map((contest: ContestParticipation, index: number) => (
                  <div 
                    key={typeof contest.contestId === 'object' ? contest.contestId?._id : contest.contestId || `contest-${index}`}
                    className="p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-lg border border-[#1e293b] hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">
                          {typeof contest.contestId === 'object' ? contest.contestId?.title : contest.title || "Unknown Contest"}
                        </h4>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {contest.joinedAt ? format(new Date(contest.joinedAt), 'MMM dd, yyyy') : 'N/A'}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium flex items-center justify-end mb-1">
                          <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
                          <span className="text-yellow-400">#{contest.rank || 'N/A'}</span>
                        </div>
                        <div className="text-sm">
                          Score: <span className="text-green-400 font-semibold">{contest.score || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No contest participation yet.</p>
                <p className="text-xs mt-1">Join a contest to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Code2 className="w-5 h-5 mr-2 text-blue-400" />
              Recently Solved Problems
            </h3>
            {loading ? (
              <div className="text-center py-6 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                <p className="mt-2 text-sm">Loading solutions...</p>
              </div>
            ) : recentSolutions.length > 0 ? (
              <div className="space-y-4">
                {recentSolutions.map((solution: RecentSolution, index: number) => {
                  return (
                    <div 
                      key={solution.problemId || `solution-${index}`}
                      onClick={() => {
                        if (solution.contestId && solution.problemId) {
                          // Store navigation source in sessionStorage
                          sessionStorage.setItem('practiceModeSource', 'profile');
                          router.push(`/problems/solve/${solution.contestId}/${solution.problemId}`);
                        }
                      }}
                      className={`p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-lg border border-[#1e293b] hover:border-green-500/30 transition-all ${
                        solution.contestId ? 'cursor-pointer hover:scale-[1.02]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">
                              {solution.problemTitle}
                            </h4>
                            {solution.contestId && (
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                            <div className="flex items-center">
                              <Tag className={`w-3 h-3 mr-1 ${getDifficultyColor(solution.difficulty)}`} />
                              <span className={getDifficultyColor(solution.difficulty)}>
                                {solution.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {solution.solvedAt ? format(new Date(solution.solvedAt), 'MMM dd, yyyy') : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          {solution.languageUsed && (
                            <div className="text-sm mb-1">
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                {solution.languageUsed}
                              </span>
                            </div>
                          )}
                          {solution.score !== undefined && (
                            <div className="text-sm">
                              <span className="text-green-400 font-semibold">{solution.score} pts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : recentProblems.length > 0 ? (
              <div className="space-y-4">
                {recentProblems.map((problem: SolvedProblem, index: number) => (
                  <div 
                    key={typeof problem.problemId === 'object' ? problem.problemId?._id : problem.problemId || `problem-${index}`}
                    className="p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-lg border border-[#1e293b] hover:border-green-500/30 transition-all"
                  >
                    <div>
                      <h4 className="font-medium text-white mb-2">
                        {typeof problem.problemId === 'object' ? problem.problemId?.title : problem.title || "Unknown Problem"}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <div className="flex items-center">
                          <Tag className={`w-3 h-3 mr-1 ${getDifficultyColor(
                            typeof problem.problemId === 'object' ? problem.problemId?.difficulty : problem.difficulty
                          )}`} />
                          <span className={getDifficultyColor(
                            typeof problem.problemId === 'object' ? problem.problemId?.difficulty : problem.difficulty
                          )}>
                            {typeof problem.problemId === 'object' ? problem.problemId?.difficulty : problem.difficulty || 'Medium'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {problem.solvedAt ? format(new Date(problem.solvedAt), 'MMM dd, yyyy') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Code2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No problems solved yet.</p>
                <p className="text-xs mt-1">Start solving problems to track your progress!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileActivity;