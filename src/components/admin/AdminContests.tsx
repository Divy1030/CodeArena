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
    const startDate = new Date(contest.startTime);
    const endDate = new Date(contest.endTime);
    
    switch (filter) {
      case 'upcoming':
        return now < startDate;
      case 'active':
        return now >= startDate && now <= endDate;
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
      
      {filteredContests.length > 0 ? (
        <div className="bg-[#121B38] border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#0f172a]">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Title</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Start Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">End Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContests.map((contest) => {
                  const now = new Date();
                  const startDate = new Date(contest.startTime);
                  const endDate = new Date(contest.endTime);
                  
                  let status;
                  let statusClass;
                  
                  if (now < startDate) {
                    status = 'Upcoming';
                    statusClass = 'bg-blue-900/50 text-blue-400';
                  } else if (now >= startDate && now <= endDate) {
                    status = 'Active';
                    statusClass = 'bg-green-900/50 text-green-400';
                  } else {
                    status = 'Ended';
                    statusClass = 'bg-gray-700/50 text-gray-400';
                  }
                  
                  return (
                    <tr key={contest._id} className="border-t border-gray-700 hover:bg-[#1a2540]">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-white">{contest.title}</div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">
                          {contest.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-300">
                        {formatDate(contest.startTime)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-300">
                        {formatDate(contest.endTime)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          {/* View Details Button */}
                          <Link 
                            href={`/contest/${contest._id}?isAdmin=true&returnPath=/admin/profile`}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-1" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            View
                          </Link>
                          
                          {/* Edit Button */}
                          <Link 
                            href={`/contest/edit/${contest._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-1" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </Link>
                          
                          {/* Manage Button */}
                          <Link 
                            href={`/contest/manage/${contest._id}/signups`}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-1" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            Manage
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#121B38] border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">No contests found matching the selected filter.</p>
        </div>
      )}
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
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
};

export default AdminContests;