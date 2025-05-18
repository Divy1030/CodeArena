import React, { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Users, 
  Boxes, 
  BarChart, 
  Tag,
  Award,
  CheckCircle,
  XCircle,
  User,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/dashboard/button';

interface ContestDetailsProps {
  contest: any;
  isAdmin?: boolean;
}

// Interface for user data
interface UserData {
  _id: string;
  username: string;
  profilePicture?: string;
}

const ContestDetails: React.FC<ContestDetailsProps> = ({ 
  contest, 
  isAdmin = false 
}) => {
  const [organizerData, setOrganizerData] = useState<UserData | null>(null);
  const [moderatorsData, setModeratorsData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch organizer data if we only have the ID
    const fetchOrganizerData = async () => {
      if (!contest?.organizer || typeof contest.organizer !== 'string') return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/user/${contest.organizer}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrganizerData(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching organizer data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch moderators data if we have moderators array
    const fetchModeratorsData = async () => {
      if (!contest?.moderators || !Array.isArray(contest.moderators)) return;
      
      const moderatorPromises = contest.moderators.map(async (modId: string) => {
        if (typeof modId !== 'string') return null;
        
        try {
          const response = await fetch(`/api/user/${modId}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              return data.data;
            }
          }
          return null;
        } catch (error) {
          console.error(`Error fetching moderator ${modId}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(moderatorPromises);
      setModeratorsData(results.filter(mod => mod !== null));
    };

    if (typeof contest.organizer === 'string') {
      fetchOrganizerData();
    } else if (contest.organizer) {
      setOrganizerData(contest.organizer);
    }

    if (Array.isArray(contest.moderators)) {
      fetchModeratorsData();
    }
  }, [contest]);

  if (!contest) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy, h:mm a') : "Invalid Date";
  };

  const getContestStatus = () => {
    const now = new Date();
    const startDate = new Date(contest.startTime);
    const endDate = new Date(contest.endTime);
    
    if (now < startDate) {
      return {
        label: "Upcoming",
        color: "bg-blue-600",
        textColor: "text-blue-300"
      };
    } else if (now >= startDate && now <= endDate) {
      return {
        label: "Active",
        color: "bg-green-600",
        textColor: "text-green-300"
      };
    } else {
      return {
        label: "Ended",
        color: "bg-gray-600",
        textColor: "text-gray-300"
      };
    }
  };

  const status = getContestStatus();

  return (
    <div className="space-y-8">
      {/* Contest Header */}
      <div className="bg-[#121B38] border border-gray-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-2xl font-bold">{contest.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${status.color}/50 ${status.textColor}`}>
                {status.label}
              </span>
            </div>
            
            <p className="text-gray-400 mt-2">{contest.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Start Date</div>
                  <div className="text-md">{formatDate(contest.startTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">End Date</div>
                  <div className="text-md">{formatDate(contest.endTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="text-md">{contest.duration || "N/A"} mins</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Difficulty</div>
                  <div className="text-md capitalize">{contest.difficulty || "Medium"}</div>
                </div>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex flex-col gap-3 self-start flex-shrink-0">
              <Link href={`/contest/edit/${contest._id}`}>
                <Button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 w-full"
                >
                  Edit Contest
                </Button>
              </Link>
              <Link href={`/contest/manage/${contest._id}/signups`}>
                <Button
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 w-full"
                >
                  Manage Signups
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={<Users className="h-8 w-8 text-blue-400" />}
          title="Participants"
          value={contest.participants?.length || 0}
        />
        <StatsCard 
          icon={<Boxes className="h-8 w-8 text-purple-400" />}
          title="Problems"
          value={contest.problems?.length || 0}
        />
        <StatsCard 
          icon={<Award className="h-8 w-8 text-yellow-400" />}
          title="Max Points"
          value={calculateTotalPoints(contest.problems)}
        />
        <StatsCard 
          icon={<BarChart className="h-8 w-8 text-green-400" />}
          title="Submissions"
          value={calculateTotalSubmissions(contest.problems)}
        />
      </div>

      {/* Problems Section */}
      <div className="bg-[#121B38] border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Problems</h2>
        </div>
        <div className="p-5">
          {contest.problems && contest.problems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="pb-3 pr-6">Title</th>
                    <th className="pb-3 pr-6">Difficulty</th>
                    <th className="pb-3 pr-6">Points</th>
                    <th className="pb-3 pr-6">Submissions</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contest.problems.map((problem: any, index: number) => (
                    <tr key={problem._id || index} className="border-t border-gray-700">
                      <td className="py-3 pr-6">
                        <Link href={`/problem/${problem._id}`} className="text-blue-400 hover:underline">
                          {problem.title || `Problem ${index + 1}`}
                        </Link>
                      </td>
                      <td className="py-3 pr-6">
                        <span className={getDifficultyBadgeClass(problem.difficulty)}>
                          {problem.difficulty || "Medium"}
                        </span>
                      </td>
                      <td className="py-3 pr-6">{problem.points || 100}</td>
                      <td className="py-3 pr-6">{problem.submissionCount || 0}</td>
                      <td className="py-3">
                        {problem.isActive !== undefined ? (
                          problem.isActive ? 
                            <CheckCircle className="h-5 w-5 text-green-500" /> : 
                            <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No problems have been added to this contest yet.
            </div>
          )}
        </div>
      </div>

      {/* Rules Section */}
      <div className="bg-[#121B38] border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Contest Rules</h2>
        </div>
        <div className="p-5">
          {contest.rules && contest.rules.length > 0 ? (
            <div className="prose prose-invert max-w-none">
              {/* Render rules with proper formatting */}
              <pre className="whitespace-pre-wrap text-gray-300 font-sans text-base">
                {contest.rules}
              </pre>
            </div>
          ) : (
            <div className="text-gray-400">
              <p>Standard contest rules apply:</p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-4 text-gray-400">
                <li>Participants must solve problems individually.</li>
                <li>Plagiarism will result in disqualification.</li>
                <li>Solutions must pass all test cases to receive points.</li>
                <li>Points are awarded based on problem difficulty and time taken.</li>
                <li>The leaderboard will be updated in real-time.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Contest Management Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organizer Info */}
        <div className="bg-[#121B38] border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-700 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Organizer</h2>
          </div>
          <div className="p-5">
            {organizerData ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {organizerData.profilePicture ? (
                    <img 
                      src={organizerData.profilePicture} 
                      alt={organizerData.username || "Organizer"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-gray-300">
                      {(organizerData.username || "O").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {organizerData.username || "Anonymous Organizer"}
                  </div>
                  <div className="text-sm text-gray-400">
                    Contest Organizer
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Organizer information unavailable
              </div>
            )}
          </div>
        </div>

        {/* Moderators Info */}
        <div className="bg-[#121B38] border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-700 flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold">Moderators</h2>
          </div>
          <div className="p-5">
            {moderatorsData.length > 0 ? (
              <div className="space-y-4">
                {moderatorsData.map((moderator, index) => (
                  <div key={moderator._id || index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {moderator.profilePicture ? (
                        <img 
                          src={moderator.profilePicture} 
                          alt={moderator.username || "Moderator"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-300">
                          {(moderator.username || "M").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {moderator.username || "Anonymous Moderator"}
                      </div>
                      <div className="text-sm text-gray-400">
                        Contest Moderator
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : contest.moderators && contest.moderators.length > 0 ? (
              <div className="animate-pulse space-y-4">
                {Array.from({ length: Math.min(3, contest.moderators.length) }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-24"></div>
                      <div className="h-3 bg-gray-700 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">
                No moderators assigned to this contest
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const StatsCard = ({ 
  icon, 
  title, 
  value 
}: { 
  icon: React.ReactNode, 
  title: string, 
  value: number | string 
}) => {
  return (
    <div className="bg-[#121B38] border border-gray-700 rounded-xl p-5">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-[#0f172a]">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-400">{title}</div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const calculateTotalPoints = (problems: any[] = []) => {
  if (!problems || problems.length === 0) return 0;
  return problems.reduce((sum, problem) => sum + (problem.points || 100), 0);
};

const calculateTotalSubmissions = (problems: any[] = []) => {
  if (!problems || problems.length === 0) return 0;
  return problems.reduce((sum, problem) => sum + (problem.submissionCount || 0), 0);
};

const getDifficultyBadgeClass = (difficulty: string = "medium") => {
  const lowerDifficulty = difficulty.toLowerCase();
  if (lowerDifficulty === "easy") {
    return "px-2 py-1 rounded-full text-xs bg-green-900/50 text-green-400";
  } else if (lowerDifficulty === "hard") {
    return "px-2 py-1 rounded-full text-xs bg-red-900/50 text-red-400";
  } else {
    return "px-2 py-1 rounded-full text-xs bg-yellow-900/50 text-yellow-400";
  }
};

export default ContestDetails;