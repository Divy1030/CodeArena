import React from 'react';
import { Trophy, Star, Code, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/dashboard/Card';
import { ProgrammingLanguageChart } from './charts/ProgrammingLanguageChart';
import { PerformanceChart } from './charts/PerformanceChart';

// Updated interface for contests to match the parent component structure
interface Contest {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  joinedAt?: string;
  rank?: number | string;
  score?: number;
  status?: 'upcoming' | 'live' | 'past';
  hasJoined?: boolean;
  [key: string]: unknown; // Allow other properties
}

// Updated interface for problems to match the parent component structure
interface Problem {
  problemId?: { 
    _id: string; 
    title: string; 
    difficulty?: string 
  } | string;
  solvedAt?: string;
  points?: number;
  status?: string;
  submissionId?: string;
  [key: string]: unknown; // Allow other properties
}

// Updated interface to match the UserData from parent
interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  password?: string;
  rating?: number;
  contestsParticipated?: Contest[];
  solvedProblems?: Problem[];
  following?: Array<{ _id: string; username?: string; profilePicture?: string }>;
  followers?: Array<{ _id: string; username?: string; profilePicture?: string }>;
  rank?: string | number;
  [key: string]: unknown; // Allow other properties
}

interface ProfileStatsProps {
  user: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ user: initialUser }) => {
  const [user, setUser] = React.useState<UserProfile>(initialUser);

  // Listen for user data updates
  React.useEffect(() => {
    const handleUserDataUpdate = () => {
      try {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData) as UserProfile;
          console.log('\ud83d\udcca ProfileStats updated:', {
            rating: parsedUserData.rating,
            solved: parsedUserData.solvedProblems?.length
          });
          setUser(parsedUserData);
        }
      } catch (err) {
        console.error("Error loading updated user data:", err);
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  // Update when prop changes
  React.useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Calculate number of solved problems (handle both formats)
  const solvedProblemCount = user.solvedProblems?.length || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Trophy className="text-yellow-500" />}
          value={user.rating || 0}
          label="Rating"
        />
        <StatCard 
          icon={<Star className="text-purple-500" />}
          value={user.contestsParticipated?.length || 0}
          label="Contests"
        />
        <StatCard 
          icon={<Code className="text-blue-500" />}
          value={solvedProblemCount}
          label="Problems Solved"
        />
        <StatCard 
          icon={<Target className="text-green-500" />}
          value={user.rank || "N/A"}
          label="Global Rank"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Languages Used</h3>
            <div className="h-[250px]">
              <ProgrammingLanguageChart />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Performance Trend</h3>
            <div className="h-[250px]">
              <PerformanceChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: number | string, label: string }) => {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center">
        <div className="mb-2">
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;