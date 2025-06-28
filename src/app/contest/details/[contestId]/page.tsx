"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/dashboard/button";
import { Card, CardContent } from "@/components/ui/dashboard/Card";
import { Share2, AlertTriangle } from "lucide-react";
import { toast } from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';

interface Problem {
  _id: string;
  title: string;
  difficulty?: string;
}

interface Participant {
  userId: string;
  joinedAt: string;
}

interface ContestData {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  participants: Participant[];
  problems?: Problem[];
  isRated: boolean;
  tags?: string[];
  rules?: string;
  landingPageTitle?: string;
  landingPageDescription?: string;
  prizes?: string;
  scoring?: string;
  hasJoined?: boolean;
  status?: 'upcoming' | 'live' | 'past';
}

interface UserData {
  _id: string;
  username?: string;
  role?: string;
}

const ContestDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState<ContestData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [contestCountdown, setContestCountdown] = useState<string>('');

  // Get user data
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, []);

  // Fetch contest details
  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/contest/getContestById/${contestId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch contest details (${response.status})`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          const contestData = result.data;
          
          // Add status and check if user has joined
          const now = new Date();
          const startTime = new Date(contestData.startTime);
          const endTime = new Date(contestData.endTime);
          
          let status: 'upcoming' | 'live' | 'past';
          
          if (now < startTime) {
            status = 'upcoming';
          } else if (now >= startTime && now <= endTime) {
            status = 'live';
          } else {
            status = 'past';
          }
          
          // Check if user has already joined
          const hasJoined = userData && contestData.participants?.some(
            (p: Participant) => p.userId === userData._id
          );
          
          setContest({
            ...contestData,
            status,
            hasJoined
          });
        } else {
          setError(result.message || 'Failed to fetch contest details');
        }
      } catch (error) {
        console.error('Error fetching contest details:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (contestId) {
      fetchContestDetails();
    }
  }, [contestId, userData]);
  
  // Update countdown timer
  useEffect(() => {
    if (!contest || contest.status !== 'upcoming') return;
    
    const updateCountdown = () => {
      const now = new Date();
      const startTime = new Date(contest.startTime);
      const diff = startTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        // Contest has started, refresh the page
        window.location.reload();
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      let countdownText = '';
      if (days > 0) countdownText += `${days}d `;
      if (hours > 0 || days > 0) countdownText += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) countdownText += `${minutes}m `;
      countdownText += `${seconds}s`;
      
      setContestCountdown(countdownText);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [contest]);

  // Join contest
  const handleJoinContest = async () => {
    if (!userData) {
      toast.error('You must be logged in to join a contest');
      router.push('/login');
      return;
    }
    
    setIsJoining(true);
    
    try {
      const response = await fetch(`/api/contest/join-contest/${contestId}`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Successfully joined the contest!');
        setContest(prev => prev ? { ...prev, hasJoined: true } : null);
      } else {
        toast.error(data.message || 'Failed to join contest');
      }
    } catch (err) {
      console.error('Error joining contest:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };
  
  // Handle enter contest - only for live contests the user has joined
  const handleEnterContest = () => {
    if (contest?.status === 'live' && contest.hasJoined) {
      router.push(`/contest/participate/${contestId}`);
    } else if (!contest?.hasJoined) {
      toast.error('You need to join this contest first');
    } else if (contest?.status !== 'live') {
      toast.error('This contest is not currently live');
    }
  };
  
  // Share contest
  const handleShareContest = () => {
    if (navigator.share) {
      navigator.share({
        title: contest?.title || 'Coding Contest',
        text: `Join me in the ${contest?.title} coding contest!`,
        url: window.location.href,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Contest URL copied to clipboard!');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading contest details...</p>
      </div>
    );
  }
  
  if (error || !contest) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-8">
        <div className="max-w-4xl mx-auto bg-red-900/20 border border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold flex items-center">
            <AlertTriangle className="mr-2" /> Error
          </h2>
          <p className="mt-2">{error || 'Contest not found'}</p>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push('/user/home')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Header */}
      <div className="bg-[#1e293b] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
              <p className="text-gray-300 max-w-2xl">{contest.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {contest.tags?.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-blue-800 rounded-full px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="border-gray-600 hover:bg-gray-700"
              onClick={handleShareContest}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Contest details */}
          <div className="md:col-span-2">
            {/* Contest status card */}
            <Card className="bg-[#1e293b] mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contest Status</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className={`font-medium ${
                      contest.status === 'upcoming' ? 'text-blue-400' :
                      contest.status === 'live' ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {contest.status === 'upcoming' ? 'Upcoming' :
                       contest.status === 'live' ? 'LIVE NOW' : 'Ended'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Participants</p>
                    <p className="font-medium">{contest.participants?.length || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Start Time</p>
                    <p className="font-medium">{format(new Date(contest.startTime), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">End Time</p>
                    <p className="font-medium">{format(new Date(contest.endTime), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="font-medium">{contest.duration} minutes</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Rated</p>
                    <p className="font-medium">{contest.isRated ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                {contest.status === 'upcoming' && (
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm">Contest starts in:</p>
                    <p className="text-2xl font-bold font-mono text-blue-400">{contestCountdown}</p>
                  </div>
                )}
                
                {contest.status === 'live' && (
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm">Contest ends in:</p>
                    <p className="text-2xl font-bold font-mono text-red-400">
                      {formatDistanceToNow(new Date(contest.endTime), { addSuffix: false })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Rules and info */}
            <Card className="bg-[#1e293b] mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contest Rules</h2>
                
                <div className="whitespace-pre-line">
                  {contest.rules || 'No specific rules provided for this contest.'}
                </div>
              </CardContent>
            </Card>
            
            {/* Problems preview (only visible if contest is over or admin) */}
            {(contest.status === 'past' || userData?.role === 'admin') && contest.problems && contest.problems.length > 0 && (
              <Card className="bg-[#1e293b]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Problems</h2>
                  
                  <div className="space-y-2">
                    {contest.problems.map((problem, index) => (
                      <div key={problem._id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                        <div>
                          <h3 className="font-medium">{String.fromCharCode(65 + index)}. {problem.title}</h3>
                          {problem.difficulty && (
                            <span className={`text-xs rounded px-2 py-0.5 ${
                              problem.difficulty.toLowerCase() === 'easy' ? 'bg-green-500 text-white' :
                              problem.difficulty.toLowerCase() === 'hard' ? 'bg-red-500 text-white' :
                              'bg-yellow-500 text-black'
                            }`}>
                              {problem.difficulty}
                            </span>
                          )}
                        </div>
                        
                        <Link href={`/problem/${problem._id}`}>
                          <Button variant="outline" className="text-sm border-blue-700 hover:bg-blue-900/30">
                            View Problem
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right column - Actions */}
          <div>
            {/* Action card */}
            <Card className="bg-[#1e293b] mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Actions</h2>
                
                {contest.status === 'upcoming' && !contest.hasJoined && (
                  <Button 
                    className="w-full mb-3 bg-blue-600 hover:bg-blue-700"
                    onClick={handleJoinContest}
                    disabled={isJoining}
                  >
                    {isJoining ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Joining...
                      </>
                    ) : 'Register for Contest'}
                  </Button>
                )}
                
                {contest.status === 'upcoming' && contest.hasJoined && (
                  <div className="mb-3 p-3 bg-green-900/30 text-green-300 border border-green-700/50 rounded-md text-center">
                    You are registered for this contest!
                  </div>
                )}
                
                {contest.status === 'live' && !contest.hasJoined && (
                  <Button 
                    className="w-full mb-3 bg-blue-600 hover:bg-blue-700"
                    onClick={handleJoinContest}
                    disabled={isJoining}
                  >
                    {isJoining ? 'Joining...' : 'Join Contest Now'}
                  </Button>
                )}
                
                {contest.status === 'live' && contest.hasJoined && (
                  <Button 
                    className="w-full mb-3 bg-green-600 hover:bg-green-700"
                    onClick={handleEnterContest}
                  >
                    Start Contest
                  </Button>
                )}
                
                {contest.status === 'past' && (
                  <Button 
                    className="w-full mb-3 bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push(`/contest/results/${contestId}`)}
                  >
                    View Results
                  </Button>
                )}
                
                {userData?.role === 'admin' && (
                  <Button 
                    className="w-full mb-3 bg-orange-600 hover:bg-orange-700"
                    onClick={() => router.push(`/contest/edit/${contestId}`)}
                  >
                    Edit Contest
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Sidebar info cards */}
            {contest.prizes && (
              <Card className="bg-[#1e293b] mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-2">Prizes</h2>
                  <div className="whitespace-pre-line text-sm">
                    {contest.prizes}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {contest.scoring && (
              <Card className="bg-[#1e293b]">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-2">Scoring</h2>
                  <div className="whitespace-pre-line text-sm">
                    {contest.scoring}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsPage;