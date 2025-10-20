"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, ArrowRight, Trophy, Users, Settings } from 'lucide-react';

interface Contest {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  organizer: string;
  moderators: string[];
  status?: 'upcoming' | 'live' | 'past';
}

interface ManageableContestsProps {
  userId: string;
}

const ManageableContests: React.FC<ManageableContestsProps> = ({ userId }) => {
  const [contests, setContests] = useState<{
    asOrganizer: Contest[];
    asModerator: Contest[];
    asAdmin: Contest[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'organizer' | 'moderator' | 'admin'>('organizer');

  useEffect(() => {
    async function fetchManageableContests() {
      try {
        const response = await fetch('/api/user/manageable-contests');
        const data = await response.json();
        
        if (data.success) {
          console.log("Received contests data:", data.contests);
          
          // Process contests to add status
          const processContests = (contestsList: Contest[]) => {
            return contestsList.map(contest => {
              const now = new Date();
              const startTime = new Date(contest.startTime);
              const endTime = new Date(contest.endTime);
              
              let status: 'upcoming' | 'live' | 'past';
              if (now < startTime) {
                status = 'upcoming';
              } else if (now >= startTime && now <= endTime) {
                status = 'live';
              } else {
                status = 'past';
              }
              
              return { ...contest, status };
            });
          };
          
          setContests({
            asOrganizer: processContests(data.contests.asOrganizer || []),
            asModerator: processContests(data.contests.asModerator || []),
            asAdmin: processContests(data.contests.asAdmin || [])
          });
          
          // Auto-select first non-empty tab
          if (data.contests.asOrganizer?.length) {
            setActiveTab('organizer');
          } else if (data.contests.asModerator?.length) {
            setActiveTab('moderator');
          } else if (data.contests.asAdmin?.length) {
            setActiveTab('admin');
          }
        } else {
          console.error("API error:", data.message);
          toast.error(data.message || 'Failed to fetch contests');
        }
      } catch (err) {
        console.error('Error fetching manageable contests:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchManageableContests();
  }, [userId]);

  // Returns a CSS class and icon for the status badge
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          class: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
          pulse: false
        };
      case 'live':
        return {
          class: 'bg-green-500/20 text-green-400 border border-green-500/30',
          pulse: true
        };
      case 'past':
        return {
          class: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
          pulse: false
        };
      default:
        return {
          class: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
          pulse: false
        };
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActiveContests = () => {
    if (!contests) return [];
    
    switch (activeTab) {
      case 'organizer':
        return contests.asOrganizer;
      case 'moderator':
        return contests.asModerator;
      case 'admin':
        return contests.asAdmin;
      default:
        return [];
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'organizer':
        return <Trophy size={16} className="mr-2" />;
      case 'moderator':
        return <Users size={16} className="mr-2" />;
      case 'admin':
        return <Settings size={16} className="mr-2" />;
      default:
        return null;
    }
  };

  const hasNoContests = !contests || 
    (contests.asOrganizer.length === 0 && 
     contests.asModerator.length === 0 && 
     contests.asAdmin.length === 0);

  const activeContests = getActiveContests();

  if (isLoading) {
    return (
      <div className="bg-[#121B38] rounded-xl p-6 border border-[#1e293b]">
        <div className="flex items-center mb-6">
          <Settings className="w-5 h-5 mr-2 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Manageable Contests</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-400">Loading contests...</p>
        </div>
      </div>
    );
  }

  if (hasNoContests) {
    return (
      <div className="bg-[#121B38] rounded-xl p-6 border border-[#1e293b]">
        <div className="flex items-center mb-6">
          <Settings className="w-5 h-5 mr-2 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Manageable Contests</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 text-sm">You don&apos;t have any contests to manage yet.</p>
          <p className="text-gray-500 text-xs mt-1">Create a contest or become a moderator to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121B38] rounded-xl p-6 border border-[#1e293b]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Manageable Contests</h3>
        </div>
        <div className="text-xs text-gray-400">
          {activeContests.length} contest{activeContests.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Improved Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-[#0f1629] p-1 rounded-lg">
          {contests?.asOrganizer.length > 0 && (
            <button
              onClick={() => setActiveTab('organizer')}
              className={`flex-1 flex items-center justify-center py-2.5 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'organizer'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              {getTabIcon('organizer')}
              <span className="hidden sm:inline">Organizer</span>
              <span className="sm:hidden">Org</span>
              <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {contests.asOrganizer.length}
              </span>
            </button>
          )}
          
          {contests?.asModerator.length > 0 && (
            <button
              onClick={() => setActiveTab('moderator')}
              className={`flex-1 flex items-center justify-center py-2.5 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'moderator'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              {getTabIcon('moderator')}
              <span className="hidden sm:inline">Moderator</span>
              <span className="sm:hidden">Mod</span>
              <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {contests.asModerator.length}
              </span>
            </button>
          )}
          
          {contests?.asAdmin.length > 0 && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center py-2.5 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              {getTabIcon('admin')}
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">Adm</span>
              <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {contests.asAdmin.length}
              </span>
            </button>
          )}
        </div>
      </div>
      
      {/* Improved Contests List */}
      <div className="space-y-3">
        {activeContests.slice(0, 3).map((contest, index) => {
          const statusConfig = getStatusConfig(contest.status || '');
          
          return (
            <div 
              key={contest._id} 
              className="group bg-[#1e293b] rounded-lg p-4 border border-[#334155] hover:border-blue-500/30 hover:bg-[#1e293b]/80 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                    {contest.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                    {contest.description || 'No description available'}
                  </p>
                </div>
                
                <div className="ml-3 flex-shrink-0">
                  <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.class} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                    {statusConfig.pulse && (
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                    )}
                    {contest.status?.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* Time Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar size={14} className="mr-2 text-blue-400" />
                  <div>
                    <span className="text-gray-500">Start:</span>
                    <span className="ml-1 text-gray-300">{formatDate(contest.startTime)}</span>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={14} className="mr-2 text-green-400" />
                  <div>
                    <span className="text-gray-500">End:</span>
                    <span className="ml-1 text-gray-300">{formatDate(contest.endTime)}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex justify-end">
                <Link 
                  href={`/contest/manage/${contest._id}`}
                  className="inline-flex items-center text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md transition-all duration-200 hover:shadow-lg group/btn"
                >
                  <Settings size={14} className="mr-1.5" />
                  Manage Contest
                  <ArrowRight size={14} className="ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
        
        {/* Show More Link */}
        {activeContests.length > 3 && (
          <div className="text-center pt-2">
            <Link 
              href="/user/contests"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <span>View all {activeContests.length} contests</span>
              <ArrowRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
        
        {/* Empty State for Active Tab */}
        {activeContests.length === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-500/10 flex items-center justify-center">
              {getTabIcon(activeTab)}
            </div>
            <p className="text-gray-400 text-sm">
              No contests found as {activeTab}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageableContests;