import React from 'react';
import { PlusCircle, Users, Calendar, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/dashboard/Card';
import { AdminActivityChart } from './charts/AdminActivityChart';
import { ContestDistributionChart } from './charts/ContestDistributionChart';

// Define interfaces that match the parent component's interface structure
interface Participant {
  _id: string;
  username: string;
  email: string;
}

interface Contest {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status?: string;
  participants?: Participant[];
}

// Match the AdminData interface from the parent component
interface AdminData {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  password?: string;
  role: string;
  contestsCreated?: Contest[];
  profile?: {
    name?: string;
    institution?: string;
    country?: string;
    bio?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface AdminStatsProps {
  admin: AdminData;
}

const AdminStats: React.FC<AdminStatsProps> = ({ admin }) => {
  // Calculate statistics
  const totalContests = admin.contestsCreated?.length || 0;
  
  // Calculate total problems from all contests
  const totalProblems = admin.contestsCreated?.reduce((acc: number, contest: any) => {
    return acc + (contest.problems?.length || 0);
  }, 0) || 0;
  
  const activeContests = admin.contestsCreated?.filter((contest: Contest) => {
    const now = new Date();
    const startDate = new Date(contest.startTime);
    const endDate = new Date(contest.endTime);
    return now >= startDate && now <= endDate;
  }).length || 0;
  
  const totalParticipants = admin.contestsCreated?.reduce((acc: number, contest: Contest) => {
    return acc + (contest.participants?.length || 0);
  }, 0) || 0;
  
  // Calculate contest distribution
  const now = new Date();
  const upcomingContests = admin.contestsCreated?.filter((contest: Contest) => {
    const startDate = new Date(contest.startTime);
    return now < startDate;
  }).length || 0;
  
  const pastContests = admin.contestsCreated?.filter((contest: Contest) => {
    const endDate = new Date(contest.endTime);
    return now > endDate;
  }).length || 0;
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<PlusCircle className="text-purple-500" />}
          value={totalContests}
          label="Contests Created"
        />
        <StatCard 
          icon={<CheckSquare className="text-blue-500" />}
          value={totalProblems}
          label="Total Problems"
        />
        <StatCard 
          icon={<Calendar className="text-green-500" />}
          value={activeContests}
          label="Active Contests"
        />
        <StatCard 
          icon={<Users className="text-yellow-500" />}
          value={totalParticipants}
          label="Total Participants"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Admin Activity</h3>
            <div className="h-[250px]">
              <AdminActivityChart contests={admin.contestsCreated || []} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Contest Distribution</h3>
            <div className="h-[250px]">
              <ContestDistributionChart 
                active={activeContests}
                upcoming={upcomingContests}
                past={pastContests}
                total={totalContests}
              />
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

export default AdminStats;