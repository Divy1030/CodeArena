"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/dashboard/button";
import { Card, CardContent } from "@/components/ui/dashboard/Card";
import { User, Clock, Calendar, ChevronRight } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

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
  difficulty?: string;
  hasJoined?: boolean;
}

const UserHome: React.FC = () => {
  const router = useRouter();
  const [contests, setContests] = useState<ContestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'past'>('upcoming');
  const [userData, setUserData] = useState<any>(null);
  const [joiningContestId, setJoiningContestId] = useState<string | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, []);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
    
        const response = await fetch('/api/contest/getAllContests', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
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
            
            // Check if user has already joined
            const hasJoined = userData && contest.participants?.some(
              p => p.userId === userData._id
            );
            
            return {
              ...contest,
              status,
              difficulty,
              hasJoined
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
    
    if (userData) {
      fetchContests();
    } else {
      setLoading(false);
    }
  }, [userData]);

  // Join a contest
  const joinContest = async (contestId: string) => {
    if (!userData) {
      toast.error('You must be logged in to join a contest');
      return;
    }
    
    setJoiningContestId(contestId);
    
    try {
      const response = await fetch(`/api/contest/join-contest/${contestId}`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Successfully joined the contest!');
        
        // Update the contests list to reflect that user has joined
        setContests(prevContests => 
          prevContests.map(contest => 
            contest._id === contestId 
              ? { ...contest, hasJoined: true } 
              : contest
          )
        );
      } else {
        toast.error(data.message || 'Failed to join contest');
      }
    } catch (err) {
      console.error('Error joining contest:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setJoiningContestId(null);
    }
  };

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
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f172a] text-white">
        {/* Hero */}
        <div className="flex flex-col md:flex-row justify-between items-center px-24 py-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold leading-snug mb-4">
              Welcome to Code-Up Arena
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Participate in coding contests, solve challenging problems, and compete with coders around the world.
            </p>
            <div className="flex space-x-4">
              <Link href="#contests">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse Contests
                </Button>
              </Link>
              <Link href="/practice">
                <Button className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-900/20">
                  Practice Problems
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative w-[427px] h-[427px] mt-10 md:mt-0">
            <Image
              src="/images/dashboard/user/UserHome.webp"
              alt="Coding Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Contests Section */}
        <div id="contests" className="px-24 bg-[#121B38] py-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold">Coding Contests</h3>
            
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredContests.map((contest) => (
                <Card key={contest._id} className="bg-[#4A55A2] text-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">{contest.title}</h4>
                      <span className={`text-xs ${getDifficultyColor(contest.difficulty || 'Medium')} text-black rounded-full px-2 py-0.5`}>
                        {contest.difficulty || 'Medium'}
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
                    
                    <p className="text-sm text-gray-200 mb-2">
                      <User className="inline-block w-4 h-4 mr-1" />
                      {contest.participants?.length || 0} participants
                    </p>
                    
                    {activeTab === 'upcoming' && (
                      <p className="text-xs text-green-400 mb-4">
                        Starts {formatDistanceToNow(new Date(contest.startTime), { addSuffix: true })}
                      </p>
                    )}
                    
                    {activeTab === 'live' && (
                      <p className="text-xs text-red-400 mb-4">
                        Ends {formatDistanceToNow(new Date(contest.endTime), { addSuffix: true })}
                      </p>
                    )}
                    
                    <div className="flex space-x-2 mb-4">
                      {contest.tags?.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-blue-800 rounded-full px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {(activeTab === 'upcoming' || activeTab === 'live') && (
                      <Button
                        className={`w-full ${
                          contest.hasJoined
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={() => {
                          if (contest.hasJoined) {
                            // Allow entering contest for both upcoming and live
                            router.push(`/contest/enter-contest/${contest._id}`);
                          } else {
                            joinContest(contest._id);
                          }
                        }}
                        disabled={!!joiningContestId}
                      >
                        {joiningContestId === contest._id ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Joining...
                          </span>
                        ) : contest.hasJoined ? (
                          <>
                            Enter Contest
                            <ChevronRight className="ml-1 w-4 h-4" />
                          </>
                        ) : (
                          <>
                            {activeTab === 'upcoming' ? 'Register' : 'Join Contest'}
                            <ChevronRight className="ml-1 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    )}
                    
                    {activeTab === 'past' && (
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => router.push(`/contest/results/${contest._id}`)}
                      >
                        View Results
                      </Button>
                    )}
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

export default UserHome;