"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

interface Participant {
  id: string;
  username: string;
  signupDate: string;
  lastLogin: string | null;
}

function SignupsPage() {
  const { contestId } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        // Updated endpoint to use our new API route
        const response = await fetch(`/api/contest/participants/${contestId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch participants');
        }
        
        const data = await response.json();
        
        // Check if data was returned successfully
        if (data.success && data.participants) {
          setParticipants(data.participants);
        } else {
          throw new Error(data.message || 'Failed to load participants');
        }
      } catch (err) {
        setError('Failed to load participants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [contestId]);

  return (
    <ProtectedRoute adminOnly={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-white mb-6">Participant Signups</h2>
        
        <div className="bg-[#121B38] border border-gray-700 rounded-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading participants...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f172a] text-gray-300">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">No.</th>
                    <th className="py-3 px-4 text-left font-medium">Username</th>
                    <th className="py-3 px-4 text-left font-medium">Signup Date</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Logged In
                      <span 
                        className="inline-block ml-1 w-4 h-4 text-xs leading-4 text-center rounded-full bg-gray-700 text-gray-300 cursor-help"
                        title="Shows if the participant is currently active"
                      >
                        ?
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.length > 0 ? (
                    participants.map((participant, index) => (
                      <tr key={participant.id} className="border-t border-gray-700 hover:bg-[#1a2540]">
                        <td className="py-3 px-4 text-white">{index + 1}</td>
                        <td className="py-3 px-4 text-white">
                          <Link 
                            href={`/user/${participant.id}?from=contest-admin&contestId=${contestId}`}
                            className="text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            {participant.username}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{new Date(participant.signupDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-300">{participant.lastLogin ? '✓' : '✗'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center italic text-gray-500">
                        Your contest has zero signups.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {error && <div className="mt-4 text-center p-3 bg-red-900/30 border border-red-700/50 text-red-400 rounded">{error}</div>}
      </div>
    </ProtectedRoute>
  );
}

export default SignupsPage;