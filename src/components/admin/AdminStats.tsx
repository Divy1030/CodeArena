import React from 'react';
import { PlusCircle, Users, Calendar, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/dashboard/Card';
import { AdminActivityChart } from './charts/AdminActivityChart';
import { ContestDistributionChart } from './charts/ContestDistributionChart';

interface AdminStatsProps {
  admin: any;
}

const AdminStats: React.FC<AdminStatsProps> = ({ admin }) => {
  // Calculate statistics
  const totalContests = admin.contestsCreated?.length || 0;
  const totalProblems = admin.contestsCreated?.reduce((acc: number, contest: any) => {
    return acc + (contest.problems?.length || 0);
  }, 0) || 0;
  
  const activeContests = admin.contestsCreated?.filter((contest: any) => {
    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);
    return now >= startDate && now <= endDate;
  }).length || 0;
  
  const totalParticipants = admin.contestsCreated?.reduce((acc: number, contest: any) => {
    return acc + (contest.participants?.length || 0);
  }, 0) || 0;
  
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
              <AdminActivityChart />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Contest Distribution</h3>
            <div className="h-[250px]">
              <ContestDistributionChart />
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