"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

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

  // Returns a CSS class for the status badge
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-600 text-white';
      case 'live':
        return 'bg-green-600 text-white';
      case 'past':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const hasNoContests = !contests || 
    (contests.asOrganizer.length === 0 && 
     contests.asModerator.length === 0 && 
     contests.asAdmin.length === 0);

  const activeContests = getActiveContests();

  if (isLoading) {
    return (
      <div className="bg-[#121B38] rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-medium text-white">Manageable Contests</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (hasNoContests) {
    return (
      <div className="bg-[#121B38] rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-medium text-white">Manageable Contests</h3>
        <div className="py-6 text-center">
          <p className="text-gray-400">You don&apos;t have any contests to manage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121B38] rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-medium text-white">Manageable Contests</h3>
      
      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex -mb-px space-x-6">
          {contests?.asOrganizer.length > 0 && (
            <button
              onClick={() => setActiveTab('organizer')}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'organizer'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              As Organizer ({contests.asOrganizer.length})
            </button>
          )}
          
          {contests?.asModerator.length > 0 && (
            <button
              onClick={() => setActiveTab('moderator')}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'moderator'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              As Moderator ({contests.asModerator.length})
            </button>
          )}
          
          {contests?.asAdmin.length > 0 && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'admin'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              As Admin ({contests.asAdmin.length})
            </button>
          )}
        </nav>
      </div>
      
      {/* Contests List */}
      <div className="space-y-3 mt-4">
        {activeContests.slice(0, 3).map((contest) => (
          <div key={contest._id} className="bg-[#1e293b] rounded-lg p-4 hover:bg-[#1c2434] transition-colors">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-blue-400">{contest.title}</h4>
              <span className={`text-xs px-2 py-1 rounded ${getStatusClass(contest.status || '')}`}>
                {contest.status?.toUpperCase()}
              </span>
            </div>
            
            <p className="text-sm text-gray-400 mt-2 line-clamp-1">{contest.description || 'No description'}</p>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center text-xs text-gray-400">
                <Calendar size={12} className="mr-1" />
                <span>Start: {formatDate(contest.startTime)}</span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Clock size={12} className="mr-1" />
                <span>End: {formatDate(contest.endTime)}</span>
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <Link 
                href={`/contest/manage/${contest._id}`}
                className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md flex items-center"
              >
                Manage Contest <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        ))}
        
        {activeContests.length > 3 && (
          <div className="text-center mt-4">
            <Link 
              href="/user/contests"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all {activeContests.length} contests
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageableContests;