'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { RefreshCw, Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  profilePicture?: string;
  score: number;
  problemsSolved: number;
}

interface LeaderboardSectionProps {
  contestId: string;
  refreshInterval?: number; // in milliseconds, default 30000 (30 seconds)
  maxEntries?: number; // limit number of entries shown, default shows all
  showTitle?: boolean;
  className?: string;
}

export default function LeaderboardSection({
  contestId,
  refreshInterval = 30000,
  maxEntries,
  showTitle = true,
  className = '',
}: LeaderboardSectionProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch(`/api/contest/leaderboard/${contestId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch leaderboard');
      }

      const entries = maxEntries ? data.data.slice(0, maxEntries) : data.data;
      setLeaderboard(entries);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [contestId, maxEntries]);

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh at specified interval
    const interval = setInterval(() => fetchLeaderboard(true), refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchLeaderboard, refreshInterval]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-yellow-700/50';
    if (rank === 2) return 'bg-gradient-to-r from-gray-800/30 to-gray-700/20 border-gray-600/50';
    if (rank === 3) return 'bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-amber-700/50';
    return 'bg-[#0f172a] border-gray-700/50';
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className={`bg-[#121B38] border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-[#121B38] border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-400 font-semibold mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchLeaderboard()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#121B38] border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {showTitle && (
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
          </div>
          <button 
            onClick={() => fetchLeaderboard(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No participants yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f172a]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Participant</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Solved</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {leaderboard.map((entry) => (
                <tr 
                  key={entry.userId}
                  className={`transition-all hover:bg-[#1a2540] border-l-2 ${getRankClass(entry.rank)}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                      <span className={`font-bold ${entry.rank <= 3 ? 'text-white' : 'text-gray-400'}`}>
                        #{entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {entry.profilePicture ? (
                        <Image
                          src={entry.profilePicture}
                          alt={entry.username}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {entry.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-white">{entry.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className="inline-block px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-semibold">
                      {entry.problemsSolved}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className="text-lg font-bold text-blue-400">
                      {entry.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="px-4 py-2 border-t border-gray-700/50 bg-[#0f172a]/50">
        <p className="text-xs text-gray-500 text-center">
          Auto-refreshes every {refreshInterval / 1000} seconds
        </p>
      </div>
    </div>
  );
}
