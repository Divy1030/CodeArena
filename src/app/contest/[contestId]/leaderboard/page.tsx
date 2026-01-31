// client/src/app/contest/[contestId]/leaderboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import LeaderboardSection from '@/components/contest/LeaderboardSection';

interface ContestData {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  isRated: boolean;
}

export default function LeaderboardPage() {
  const params = useParams();
  const contestId = params.contestId as string;
  const [contest, setContest] = useState<ContestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContestInfo = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`/api/contest/getContestById/${contestId}`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success && data.data) {
          setContest(data.data);
        }
      } catch (error) {
        console.error('Error fetching contest info:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (contestId) {
      fetchContestInfo();
    }
  }, [contestId]);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar isAuthenticated={true} />
      
      {/* Contest Info Header */}
      <div className="bg-[#121B38] border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center text-gray-300 text-sm mb-4">
            <Link href="/contests" className="hover:text-blue-400">
              All Contests
            </Link>
            <span className="mx-2">›</span>
            {contest ? (
              <>
                <Link href={`/contest/start-contest/${contestId}`} className="hover:text-blue-400">
                  {contest.title}
                </Link>
                <span className="mx-2">›</span>
              </>
            ) : null}
            <span className="text-gray-400">Leaderboard</span>
          </div>
          
          {!loading && contest && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{contest.title}</h1>
              <p className="text-gray-400">Live Leaderboard - Updates every 30 seconds</p>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LeaderboardSection 
          contestId={contestId} 
          refreshInterval={30000}
          showTitle={true}
        />
      </div>
    </div>
  );
}