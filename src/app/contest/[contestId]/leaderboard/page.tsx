// client/src/app/contest/[contestId]/leaderboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  profilePicture?: string;
  score: number;
  problemsSolved: number;
}

export default function LeaderboardPage() {
  const params = useParams();
  const contestId = params.contestId as string;
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contest/leaderboard/${contestId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch leaderboard');
      }

      setLeaderboard(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    
    return () => clearInterval(interval);
  }, [contestId]);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-100';
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error: {error}</p>
          <button 
            onClick={fetchLeaderboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Contest Leaderboard</h1>
            <button 
              onClick={fetchLeaderboard}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Refreshing...
                </>
              ) : (
                '🔄 Refresh'
              )}
            </button>
          </div>
          <p className="text-gray-500 mt-2">Updates automatically every 30 seconds</p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No participants yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left">Participant</th>
                  <th className="px-6 py-4 text-center">Problems Solved</th>
                  <th className="px-6 py-4 text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr 
                    key={entry.userId}
                    className={`border-b transition-all hover:shadow-md ${getRankClass(entry.rank)}`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-2xl font-bold text-gray-800">
                        {getRankDisplay(entry.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {entry.profilePicture ? (
                          <Image
                            src={entry.profilePicture}
                            alt={entry.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-gray-800">{entry.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                        {entry.problemsSolved}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xl font-bold text-blue-600">
                        {entry.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}