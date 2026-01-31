"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/dashboard/button";
import { Card, CardContent } from "@/components/ui/dashboard/Card";
import { User, Plus, Clock, Calendar } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { format } from 'date-fns';

// TypeScript interface for contest data
interface ContestData {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  participants: {
    userId: string;
    joinedAt: string;
  }[];
  isRated: boolean;
  tags?: string[];
  status?: 'upcoming' | 'live' | 'past';
  difficulty?: string; // We'll determine this based on tags or duration
}

const AdminHome: React.FC = () => {
  const router = useRouter();
  const [contests, setContests] = useState<ContestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'past'>('upcoming');
  const [initializingRatings, setInitializingRatings] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');

  const handleInitializeRatings = async () => {
    if (!confirm('This will calculate ratings for all past contests. Continue?')) {
      return;
    }

    setInitializingRatings(true);
    setRatingMessage('');

    try {
      const response = await fetch('/api/contest/admin/initialize-ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setRatingMessage(`Success! Processed ${data.data.contestsProcessed} contests.`);
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setRatingMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error('Error initializing ratings:', err);
      setRatingMessage('Failed to initialize ratings. Please try again.');
    } finally {
      setInitializingRatings(false);
    }
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // Trigger rank recalculation in the background
        fetch('/api/contest/admin/recalculate-ranks', { method: 'POST' }).catch(err => 
          console.log('Rank recalculation skipped:', err)
        );

        const response = await fetch('/api/contest/getAllContests');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contests');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Process contests and add status property
          const processedContests = data.data.map((contest: ContestData) => {
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
            
            // Determine difficulty from tags or duration
            let difficulty = 'Medium';
            if (contest.tags) {
              if (contest.tags.some(tag => tag.toLowerCase().includes('easy'))) {
                difficulty = 'Easy';
              } else if (contest.tags.some(tag => tag.toLowerCase().includes('hard'))) {
                difficulty = 'Hard';
              }
            } else if (contest.duration) {
              if (contest.duration <= 60) {
                difficulty = 'Easy';
              } else if (contest.duration >= 180) {
                difficulty = 'Hard';
              }
            }
            
            return {
              ...contest,
              status,
              difficulty
            };
          });
          
          setContests(processedContests);
        } else {
          setError(data.message || 'Failed to fetch contests');
        }
      } catch (err) {
        console.error('Error fetching contests:', err);
        setError('Failed to load contests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContests();
  }, []);

  // Filter contests by status
  const filteredContests = contests.filter(contest => contest.status === activeTab);
  
  // Get difficulty color class
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-[#0f172a] text-white">
        {/* Hero */}
        <div className="flex flex-col md:flex-row justify-between items-center px-24 py-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold leading-snug mb-4">
              Enter the Arena, Unleash Your Coding Skills, and Conquer the Challenge.
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Join competitive coding contests and improve your programming skills through real-world challenges
            </p>
            <div className="flex gap-4 items-center">
              <Link href="/contest/create">
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-6">
                  <Plus size={18} />
                  Create New Contest
                </Button>
              </Link>
              <Button 
                onClick={handleInitializeRatings}
                disabled={initializingRatings}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 px-6"
              >
                {initializingRatings ? 'Calculating...' : 'Initialize Ratings'}
              </Button>
            </div>
            {ratingMessage && (
              <div className={`mt-4 p-3 rounded-lg ${
                ratingMessage.includes('Success') 
                  ? 'bg-green-900/50 border border-green-500 text-green-200' 
                  : 'bg-red-900/50 border border-red-500 text-red-200'
              }`}>
                {ratingMessage}
              </div>
            )}
          </div>
          <div className="relative w-[427px] h-[427px] mt-10 md:mt-0">
            <Image
              src="/images/dashboard/admin/AdminHome.webp"
              alt="Coding Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Manage Contests */}
        <div className="px-24 bg-[#121B38] py-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold">Manage Contests</h3>
            
            {/* Contest Tabs */}
            <div className="flex bg-[#0f172a] rounded-lg p-1">
              {['upcoming', 'live', 'past'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab as 'upcoming' | 'live' | 'past')}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading contests...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="text-center py-12 bg-[#0f172a] rounded-lg">
              <p className="text-gray-400">No {activeTab} contests found.</p>
              <Link href="/contest/create" className="mt-4 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 mt-4">
                  <Plus size={16} />
                  Create Contest
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredContests.map((contest) => (
                <Card key={contest._id} className="bg-[#4A55A2] text-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">{contest.title}</h4>
                      <span className={`text-xs ${getDifficultyColor(contest.difficulty || 'Medium')} text-black rounded-full px-2 py-0.5`}>
                        {contest.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                      {contest.description || 'No description available.'}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-300 mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(contest.startTime), 'MMM dd, yyyy')}
                      <Clock className="w-3 h-3 ml-3 mr-1" />
                      {format(new Date(contest.startTime), 'HH:mm')} - {format(new Date(contest.endTime), 'HH:mm')}
                    </div>
                    
                    <p className="text-sm text-gray-200 mb-4">
                      <User className="inline-block w-4 h-4 mr-1" />
                      {contest.participants?.length || 0} participants
                    </p>
                    
                    <div className="flex space-x-2 mb-4">
                      {contest.tags?.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-blue-800 rounded-full px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="bg-orange-400 text-black hover:bg-orange-500 flex-1"
                        onClick={() => router.push(`/contest/edit/${contest._id}`)}
                      >
                        Edit Contest
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                        onClick={() => router.push(`/contest/manage/${contest._id}`)}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminHome;