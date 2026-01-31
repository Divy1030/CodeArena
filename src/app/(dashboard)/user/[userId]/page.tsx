"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { RatingHistoryChart } from '@/components/profile/charts/RatingHistoryChart';
import { Trophy, Code, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

interface UserProfile {
  _id: string;
  username: string;
  email?: string;
  role: string;
  profilePicture?: string;
  profile?: {
    name?: string;
    institution?: string;
    country?: string;
    bio?: string;
  };
  rating?: number;
  createdAt: string;
  updatedAt?: string;
  contestsParticipated?: {
    contestId: string;
    rank: number;
    score: number;
    contestName?: string;
  }[];
  solvedProblems?: {
    problemId: string;
    difficulty: string;
    title: string;
    solvedAt: string;
  }[];
  submissions?: {
    _id: string;
    problemId: string;
    status: string;
    languageUsed: string;
    createdAt: string;
  }[];
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestId = searchParams.get('contestId');
  const fromContestAdmin = searchParams.get('from') === 'contest-admin';
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [contestNames, setContestNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Call the API route to fetch user profile
        const response = await fetch(`/api/user/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setUserProfile(data.data);
          
          // Fetch contest names if user has participated in contests
          if (data.data.contestsParticipated && data.data.contestsParticipated.length > 0) {
            const contestIds = data.data.contestsParticipated.map((c: any) => c.contestId).filter(Boolean);
            const names: { [key: string]: string } = {};
            
            // Fetch each contest name
            await Promise.all(
              contestIds.map(async (cId: string) => {
                try {
                  const contestRes = await fetch(`/api/contest/getContestById/${cId}`);
                  const contestData = await contestRes.json();
                  if (contestData.success && contestData.data) {
                    names[cId] = contestData.data.title;
                  }
                } catch (err) {
                  console.error(`Error fetching contest ${cId}:`, err);
                }
              })
            );
            
            setContestNames(names);
          }
          
          // Instead of making another API call, fetch user data from localStorage if available
          const currentUserData = localStorage.getItem('userData');
          if (currentUserData) {
            try {
              const parsedUserData = JSON.parse(currentUserData);
              setIsCurrentUser(parsedUserData._id === data.data._id);
            } catch (e) {
              console.error('Error parsing stored user data:', e);
              setIsCurrentUser(false);
            }
          }
        } else {
          throw new Error(data.message || 'Failed to load user profile');
        }
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return (
    <ProtectedRoute adminOnly={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        {fromContestAdmin && contestId && (
          <Link 
            href={`/contest/manage/${contestId}/signups`}
            className="flex items-center mb-6 text-blue-400 hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Signups
          </Link>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        ) : userProfile ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-[#121B38] border border-gray-700 rounded-xl overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  {/* Profile Picture */}
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 relative">
                    {userProfile.profilePicture ? (
                      <Image 
                        src={userProfile.profilePicture} 
                        alt={userProfile.username} 
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-4">
                      <h1 className="text-3xl font-bold text-white">{userProfile.username}</h1>
                      <div className="px-3 py-1 text-sm rounded-full bg-blue-900/50 text-blue-300 inline-block w-fit capitalize">
                        {userProfile.role}
                      </div>
                      
                      {userProfile.rating && (
                        <div className="px-3 py-1 text-sm rounded-full bg-yellow-900/50 text-yellow-300 inline-block w-fit">
                          Rating: {userProfile.rating}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Member since {new Date(userProfile.createdAt).toLocaleDateString()}
                    </p>
                    
                    {userProfile.profile?.country && (
                      <p className="text-gray-300 mt-1">
                        <span className="text-gray-500">Country:</span> {userProfile.profile.country}
                      </p>
                    )}
                    
                    {userProfile.profile?.institution && (
                      <p className="text-gray-300 mt-1">
                        <span className="text-gray-500">Institution:</span> {userProfile.profile.institution}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Bio */}
                {userProfile.profile?.bio && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-300 mb-2">About</h3>
                    <p className="text-gray-400">{userProfile.profile.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Contests</p>
                    <p className="text-3xl font-bold text-purple-500">{userProfile.contestsParticipated?.length || 0}</p>
                  </div>
                  <Trophy className="w-10 h-10 text-purple-500" />
                </div>
              </div>

              <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Best Rank</p>
                    <p className="text-3xl font-bold text-yellow-500">
                      {userProfile.contestsParticipated && userProfile.contestsParticipated.length > 0
                        ? `#${Math.min(...userProfile.contestsParticipated.map(c => c.rank || 999))}`
                        : 'N/A'}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-yellow-500" />
                </div>
              </div>

              <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Score</p>
                    <p className="text-3xl font-bold text-green-500">
                      {userProfile.contestsParticipated && userProfile.contestsParticipated.length > 0
                        ? userProfile.contestsParticipated.reduce((sum, c) => sum + (c.score || 0), 0)
                        : 0}
                    </p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </div>

              <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Avg Score</p>
                    <p className="text-3xl font-bold text-blue-500">
                      {userProfile.contestsParticipated && userProfile.contestsParticipated.length > 0
                        ? Math.round(userProfile.contestsParticipated.reduce((sum, c) => sum + (c.score || 0), 0) / userProfile.contestsParticipated.length)
                        : 0}
                    </p>
                  </div>
                  <Code className="w-10 h-10 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Contest Performance Chart */}
            {userProfile.contestsParticipated && userProfile.contestsParticipated.length > 0 && (
              <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contest Performance</h3>
                <div className="h-[250px]">
                  <RatingHistoryChart contests={userProfile.contestsParticipated} />
                </div>
              </div>
            )}
                
            {/* Contest History */}
            {userProfile.contestsParticipated && userProfile.contestsParticipated.length > 0 && (
              <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contest History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Contest</th>
                        <th className="text-center py-3 px-4 text-gray-400 font-medium">Rank</th>
                        <th className="text-center py-3 px-4 text-gray-400 font-medium">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProfile.contestsParticipated.map((contest, index) => (
                        <tr key={contest.contestId || `contest-${index}`} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                          <td className="py-3 px-4 text-gray-300">
                            {contest.contestId ? (
                              <Link href={`/contest/${contest.contestId}`} className="text-blue-400 hover:underline">
                                {contestNames[contest.contestId] || `Contest #${contest.contestId.substring(0, 8)}`}
                              </Link>
                            ) : (
                              <span className="text-gray-500">Unknown Contest</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                              contest.rank === 1 ? 'bg-yellow-900/50 text-yellow-400' :
                              contest.rank === 2 ? 'bg-gray-700/50 text-gray-300' :
                              contest.rank === 3 ? 'bg-amber-900/50 text-amber-400' :
                              'text-gray-300'
                            }`}>
                              #{contest.rank || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-300 font-semibold">{contest.score || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
                
            {/* Admin view notice */}
            {fromContestAdmin && (
              <div className="bg-[#121B38] border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  You are viewing this profile in read-only mode as a contest administrator.
                </p>
              </div>
            )}
            
            {/* Action buttons - only for own profile */}
            {isCurrentUser && (
              <div className="bg-[#121B38] border border-gray-700 rounded-lg p-6">
                <button 
                  onClick={() => router.push('/user/profile')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition duration-200 font-medium"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-800/50 border border-gray-700 rounded-lg">
            <p className="text-gray-400">User not found</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}