import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/dashboard/Card';
import { Calendar, Clock, Users, Boxes, Plus, Edit, Eye } from 'lucide-react';
import { format, isValid } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/dashboard/button';

interface AdminContestsProps {
  contests: any[];
}

const AdminContests: React.FC<AdminContestsProps> = ({ contests }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'past'>('all');
  
  // Filter contests based on selected filter
  const filteredContests = contests.filter(contest => {
    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);
    
    switch (filter) {
      case 'active':
        return now >= startDate && now <= endDate;
      case 'upcoming':
        return now < startDate;
      case 'past':
        return now > endDate;
      default:
        return true;
    }
  });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : "Invalid Date";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-bold">Created Contests</h2>
        <div className="flex flex-wrap gap-2">
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={filter === 'active'} 
            onClick={() => setFilter('active')}
          >
            Active
          </FilterButton>
          <FilterButton 
            active={filter === 'upcoming'} 
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </FilterButton>
          <FilterButton 
            active={filter === 'past'} 
            onClick={() => setFilter('past')}
          >
            Past
          </FilterButton>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {filteredContests.length > 0 ? (
            <div className="space-y-4">
              {filteredContests.map((contest) => (
                <div 
                  key={contest._id} 
                  className="p-4 bg-[#0f172a] rounded-lg"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div>
                      <Link href={`/admin/contests/${contest._id}`} className="text-lg font-medium hover:text-blue-400">
                        {contest.title}
                      </Link>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(contest.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {contest.duration} mins
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Users className="w-4 h-4 mr-1" />
                          {contest.participants?.length || 0} participants
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Boxes className="w-4 h-4 mr-1" />
                          {contest.problems?.length || 0} problems
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 self-end md:self-center">
                      <Link href={`/admin/contests/${contest._id}/edit`}>
                        <Button 
                          className="text-xs px-3 py-1 h-8 bg-blue-600 hover:bg-blue-700"
                          size="sm"
                          icon={<Edit size={14} />}
                        >
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/admin/contests/${contest._id}`}>
                        <Button 
                          className="text-xs px-3 py-1 h-8 bg-purple-600 hover:bg-purple-700"
                          size="sm"
                          icon={<Eye size={14} />}
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No contests found for the selected filter.
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Link href="/admin/contests/create">
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            icon={<Plus size={16} />}
          >
            Create New Contest
          </Button>
        </Link>
      </div>
    </div>
  );
};

const FilterButton = ({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode, 
  active: boolean, 
  onClick: () => void 
}) => {
  return (
    <button
      className={`px-3 py-1 rounded-md text-sm ${
        active 
          ? 'bg-purple-600 text-white' 
          : 'bg-[#121B38] text-gray-300 hover:bg-purple-700/30'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AdminContests;