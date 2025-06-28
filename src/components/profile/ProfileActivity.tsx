import React from 'react';
import { Card, CardContent } from '@/components/ui/dashboard/Card';
import { Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';

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

interface ProfileActivityProps {
  user: User;
}

const ProfileActivity: React.FC<ProfileActivityProps> = ({ user }) => {
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
            <h3 className="text-lg font-medium mb-4">Recent Contests</h3>
            {recentContests.length > 0 ? (
              <div className="space-y-4">
                {recentContests.map((contest: ContestParticipation, index: number) => (
                  <div 
                    key={typeof contest.contestId === 'object' ? contest.contestId?._id : contest.contestId || `contest-${index}`}
                    className="p-3 bg-[#0f172a] rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{typeof contest.contestId === 'object' ? contest.contestId?.title : contest.title || "Unknown Contest"}</h4>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {contest.joinedAt ? format(new Date(contest.joinedAt), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Rank: <span className="text-yellow-500">{contest.rank || 'N/A'}</span>
                      </div>
                      <div className="text-sm">
                        Score: <span className="text-green-500">{contest.score || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No contest participation yet.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Recently Solved Problems</h3>
            {recentProblems.length > 0 ? (
              <div className="space-y-4">
                {recentProblems.map((problem: SolvedProblem, index: number) => (
                  <div 
                    key={typeof problem.problemId === 'object' ? problem.problemId?._id : problem.problemId || `problem-${index}`}
                    className="p-3 bg-[#0f172a] rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{typeof problem.problemId === 'object' ? problem.problemId?.title : problem.title || "Unknown Problem"}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <div className="flex items-center">
                          <Tag className="w-3 h-3 mr-1" />
                          {typeof problem.problemId === 'object' ? problem.problemId?.difficulty : problem.difficulty || 'Medium'}
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
              <div className="text-center py-6 text-gray-500">
                No problems solved yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileActivity;