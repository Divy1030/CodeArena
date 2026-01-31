"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Trophy, Users } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

interface Contest {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  isRated: boolean;
  tags?: string[];
  organizationType?: string;
  organizationName?: string;
  participants?: Array<{ userId: string; joinedAt: string }>;
  landingPageTitle?: string;
  landingPageDescription?: string;
  landingPageImage?: string;
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/contest/getAllContests');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contests');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setContests(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to load contests');
        }
      } catch (err) {
        console.error('Error fetching contests:', err);
        toast.error('Failed to load contests');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContests();
  }, []);

  const getContestStatus = (contest: Contest): 'upcoming' | 'ongoing' | 'past' => {
    const now = new Date().getTime();
    const start = new Date(contest.startTime).getTime();
    const end = new Date(contest.endTime).getTime();
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'past';
  };

  const getStatusBadge = (status: 'upcoming' | 'ongoing' | 'past') => {
    switch (status) {
      case 'upcoming':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-900/30 text-blue-400 border border-blue-700">Upcoming</span>;
      case 'ongoing':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400 border border-green-700">Live</span>;
      case 'past':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-700/30 text-gray-400 border border-gray-600">Ended</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const filteredContests = contests.filter(contest => {
    if (filter === 'all') return true;
    return getContestStatus(contest) === filter;
  });

  return (
    <ProtectedRoute adminOnly={false}>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Contests</h1>
            <p className="text-gray-400">Compete with developers around the world</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-700">
            {(['all', 'upcoming', 'ongoing', 'past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 ${
                  filter === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contests List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="bg-[#121B38] border border-gray-700 rounded-lg p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">No {filter !== 'all' ? filter : ''} contests found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredContests.map((contest) => {
                const status = getContestStatus(contest);
                
                return (
                  <Link
                    key={contest._id}
                    href={`/contest/${contest._id}/preview-challenges`}
                    className="bg-[#121B38] border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      {getStatusBadge(status)}
                      {contest.isRated && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-900/30 text-yellow-400">
                          Rated
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                      {contest.title}
                    </h3>

                    {/* Description */}
                    {contest.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {contest.description}
                      </p>
                    )}

                    {/* Organization */}
                    {contest.organizationName && (
                      <div className="mb-4">
                        <span className="text-xs text-gray-500">
                          by {contest.organizationName}
                        </span>
                      </div>
                    )}

                    {/* Contest Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(contest.startTime)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(contest.duration)}</span>
                      </div>
                      
                      {contest.participants && contest.participants.length > 0 && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{contest.participants.length} participants</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {contest.tags && contest.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {contest.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded bg-[#0f172a] text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {contest.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs text-gray-500">
                            +{contest.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
