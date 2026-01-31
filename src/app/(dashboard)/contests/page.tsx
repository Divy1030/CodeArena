'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Trophy, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Contest {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  participants?: any[];
  problems?: any[];
  organizer?: {
    username: string;
  };
}

export default function ContestsPage() {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'past' | 'live' | 'upcoming'>('past');

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/contest/getAllContests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setContests(result.data || []);
      } else {
        toast.error('Failed to fetch contests');
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
      toast.error('Error loading contests');
    } finally {
      setLoading(false);
    }
  };

  const getContestStatus = (contest: Contest): 'upcoming' | 'live' | 'past' => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'live';
    return 'past';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Upcoming', pulse: false },
      live: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Live', pulse: true },
      past: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Past', pulse: false }
    };
    const badge = badges[status as keyof typeof badges] || badges.past;
    
    return (
      <span className={`px-3 py-1 text-xs rounded-full border ${badge.color} ${badge.pulse ? 'animate-pulse' : ''}`}>
        {badge.label}
      </span>
    );
  };

  const filteredContests = contests.filter(contest => {
    if (filter === 'all') return true;
    return getContestStatus(contest) === filter;
  });

  const pastContests = filteredContests.filter(c => getContestStatus(c) === 'past');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1437] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1437] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">Contests</h1>
          <p className="text-gray-300">Browse and practice with contest problems</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#121B38] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 sm:gap-4 py-4 overflow-x-auto">
            {(['all', 'past', 'live', 'upcoming'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 text-xs opacity-75">
                  ({tab === 'all' ? contests.length : contests.filter(c => getContestStatus(c) === tab).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contests Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredContests.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No contests found</h3>
            <p className="text-gray-500">Check back later for new contests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest) => {
              const status = getContestStatus(contest);
              return (
                <div
                  key={contest._id}
                  onClick={() => router.push(`/contest/${contest._id}`)}
                  className="bg-[#1a2332] border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group hover:scale-[1.02] shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {contest.title}
                    </h3>
                    {getStatusBadge(status)}
                  </div>
                  
                  {contest.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {contest.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(contest.startTime), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {format(new Date(contest.startTime), 'HH:mm')} - {format(new Date(contest.endTime), 'HH:mm')}
                    </div>
                    {contest.participants && (
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        {contest.participants.length} participants
                      </div>
                    )}
                    {contest.problems && (
                      <div className="flex items-center text-sm text-gray-400">
                        <Trophy className="w-4 h-4 mr-2" />
                        {contest.problems.length} problems
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View Contest <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
