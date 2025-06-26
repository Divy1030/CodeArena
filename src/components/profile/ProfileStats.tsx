import React from 'react';
import { Trophy, Star, Code, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/dashboard/Card';
import { ProgrammingLanguageChart } from './charts/ProgrammingLanguageChart';
import { PerformanceChart } from './charts/PerformanceChart';

// Define a proper interface for the user object instead of using 'any'
interface UserProfile {
  _id?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  rating?: number;
  contestsParticipated?: Array<any>; // We could further type this if needed
  solvedProblems?: Array<any>; // We could further type this if needed
  rank?: string | number;
  [key: string]: any; // Allow other properties we might not explicitly define
}

interface ProfileStatsProps {
  user: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
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
          value={user.solvedProblems?.length || 0}
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