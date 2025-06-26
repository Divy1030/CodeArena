"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Define interface for contest data
interface ContestData {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  participants?: {
    userId: string;
    joinedAt: string;
  }[];
  problems?: {
    _id: string;
    title: string;
  }[];
  isRated?: boolean;
  tags?: string[];
  rules?: string;
  scoring?: string;
  backgroundImage?: string;
  submissions?: unknown[];
  totalScore?: number;
  score?: number;
  rank?: string | number;
}

function formatTime(ms: number) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else if (minutes < 24 * 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
  } else {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    return `${days} day${days > 1 ? 's' : ''}${hours > 0 ? ` ${hours} hour${hours > 1 ? 's' : ''}` : ''}`;
  }
}

const EnterContestPage = () => {
  const params = useParams();
  const router = useRouter();
  const contestId = params?.contestId as string;
  const [contest, setContest] = useState<ContestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState("");
  const [timerLabel, setTimerLabel] = useState("");
  // We'll keep this variable but mark it with an underscore to indicate it's intentionally unused
  const [_isAuthenticated, setIsAuthenticated] = useState(false);
  const [countdownValues, setCountdownValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userData = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
    setIsAuthenticated(!!token && !!userData);
    
    const fetchContest = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/contest/enter-contest/${contestId}`, {
          method: "GET",
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success) {
          setContest(data.data);
        } else {
          setError(data.message || "Failed to fetch contest details.");
        }
      } catch (error) {
        console.error("Error fetching contest details:", error);
        setError("Error fetching contest details.");
      } finally {
        setLoading(false);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  // Timer logic
  useEffect(() => {
    if (!contest) return;

    const start = new Date(contest.startTime).getTime();
    const end = new Date(contest.endTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      let timeRemaining = 0;
      
      if (now < start) {
        setTimerLabel("Contest starts in");
        timeRemaining = start - now;
        setTimer(formatTime(timeRemaining));
      } else if (now >= start && now < end) {
        setTimerLabel("Time left");
        timeRemaining = end - now;
        setTimer(formatTime(timeRemaining));
      } else {
        setTimerLabel("Contest Ended");
        setTimer("");
        timeRemaining = 0;
      }
      
      // Update countdown values
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        setCountdownValues({ days, hours, minutes, seconds });
      } else {
        setCountdownValues({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  // Helper to check if contest can be started
  const canStartContest = () => {
    if (!contest) return false;
    const now = Date.now();
    const start = new Date(contest.startTime).getTime();
    const end = new Date(contest.endTime).getTime();
    return now >= start && now < end;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading contest details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-red-400">
        <div className="bg-[#1e293b] rounded-xl px-8 py-6 shadow-lg border border-red-700">
          <span className="text-xl font-semibold">{error}</span>
        </div>
      </div>
    );
  }

  if (!contest) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-800">
      
      <div className="flex-grow">
        {/* Hero section with contest 
        title, background image, and countdown */}
        <div className="relative w-full py-16 px-4 border-b border-gray-700">
          {/* Background Image */}
          {contest.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image 
                src={contest.backgroundImage}
                alt="Contest background"
                fill
                style={{ objectFit: "cover" }}
                className="opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/20"></div>
            </div>
          )}

          {!contest.backgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"></div>
          )}
          
          {/* Content overlay */}
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{contest.title}</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">{contest.description}</p>
            
            {/* Date range */}
            <div className="text-blue-300 mb-10">
              {new Date(contest.startTime).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} to {new Date(contest.endTime).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            
            {/* Action button or timer */}
            {canStartContest() ? (
              <button
                onClick={() => router.push(`/contest/start-contest/${contestId}`)}
                className="bg-blue-500 cursor-pointer text-white text-lg font-medium px-12 py-3 rounded-lg shadow-lg transition"
              >
                Start Contest
              </button>
            ) : (
              <div className="border border-blue-700 rounded-lg inline-block py-3 px-6 bg-gray-800/80">
                <div className="text-sm text-blue-300 mb-1">{timerLabel}</div>
                {timer && (
                  <div className="font-mono text-2xl font-bold text-white">{timer}</div>
                )}
                {!timer && timerLabel === "Contest Ended" && (
                  <div className="text-xl font-semibold text-red-400">Contest Ended</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Countdown timer boxes like in the image */}
        {timer && (
          <div className="bg-gray-700/50 py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-4 text-gray-300 font-medium">{timerLabel === "Contest starts in" ? "Starts in" : "Ends in"}</div>
              <div className="flex justify-center space-x-4">
                {countdownValues.days > 0 && (
                  <div className="bg-gray-700 px-6 py-4 rounded shadow-md">
                    <div className="text-3xl text-white font-bold text-center">{countdownValues.days}</div>
                    <div className="text-gray-400 text-center">days</div>
                  </div>
                )}
                <div className="bg-gray-700 px-6 py-4 rounded shadow-md">
                  <div className="text-3xl text-white font-bold text-center">{countdownValues.hours}</div>
                  <div className="text-gray-400 text-center">hrs</div>
                </div>
                <div className="bg-gray-700 px-6 py-4 rounded shadow-md">
                  <div className="text-3xl text-white font-bold text-center">{countdownValues.minutes}</div>
                  <div className="text-gray-400 text-center">mins</div>
                </div>
                <div className="bg-gray-700 px-6 py-4 rounded shadow-md">
                  <div className="text-3xl text-white font-bold text-center">{countdownValues.seconds}</div>
                  <div className="text-gray-400 text-center">secs</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content sections */}
        <div className="max-w-6xl mx-auto py-12 px-4">
          {/* About section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 pb-2 border-b border-gray-700">About</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{contest.description}</p>
          </section>
          
          {/* Rules section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 pb-2 border-b border-gray-700">Rules</h2>
            {contest.rules ? (
              <div className="text-gray-300 whitespace-pre-wrap">
                {contest.rules}
              </div>
            ) : (
              <div className="text-gray-300 space-y-4">
                <ul className="list-disc pl-5 space-y-2">
                  <li>The creator of this contest is solely responsible for setting and communicating the eligibility requirements associated with prizes awarded to participants, as well as for procurement and distribution of all prizes. The contest creator holds CodeArena harmless from and against any and all claims, losses, damages, costs, awards, settlements, orders, or fines.</li>
                  <li>Code directly from our platform, which supports over 30 languages.</li>
                  <li>Please provide any rules for your contest here.</li>
                </ul>
              </div>
            )}
          </section>

          {/* Scoring section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 pb-2 border-b border-gray-700">Scoring</h2>
            {contest.scoring ? (
              <div className="text-gray-300 whitespace-pre-wrap">
                {contest.scoring}
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Each challenge has a pre-determined score.</li>
                <li>A participant&apos;s score depends on the number of test cases a participant&apos;s code submission successfully passes.</li>
                <li>If a participant submits more than one solution per challenge, then the participant&apos;s score will reflect the highest score achieved. In a game challenge, the participant&apos;s score will reflect the last code submission.</li>
                <li>Participants are ranked by score. If two or more participants achieve the same score, then the tie is broken by the total time taken to submit the last solution resulting in a higher score.</li>
              </ul>
            )}
          </section>

          {/* Contest Info section - Two columns */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700">Contest Information</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400">Start Time</div>
                  <div className="text-white">{new Date(contest.startTime).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400">End Time</div>
                  <div className="text-white">{new Date(contest.endTime).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400">Duration</div>
                  <div className="text-white">{formatDuration(contest.duration)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Problems</div>
                  <div className="text-white">{contest.problems?.length || 0}</div>
                </div>
                <div>
                  <div className="text-gray-400">Rated</div>
                  <div className="text-white">{contest.isRated ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700">Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400">Participants</div>
                  <div className="text-white">{contest.participants?.length || 0}</div>
                </div>
                <div>
                  <div className="text-gray-400">Total Score</div>
                  <div className="text-white">{contest.totalScore || 0}</div>
                </div>
                <div>
                  <div className="text-gray-400">Submissions</div>
                  <div className="text-white">{contest.submissions?.length || 0}</div>
                </div>
                <div>
                  <div className="text-gray-400">Your Score</div>
                  <div className="text-white">{contest.score || 0}</div>
                </div>
                <div>
                  <div className="text-gray-400">Your Rank</div>
                  <div className="text-white">{contest.rank || "N/A"}</div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Action button at bottom */}
          <div className="text-center mt-12">
            {canStartContest() ? (
              <button
                onClick={() => router.push(`/contest/start-contest/${contestId}`)}
                className="bg-blue-500 cursor-pointer text-white text-lg font-medium px-12 py-4 rounded-lg shadow-lg transition"
              >
                Start Contest
              </button>
            ) : (
              <div className="text-center text-lg text-gray-400">
                {new Date(contest.startTime) > new Date() 
                  ? "Contest has not started yet" 
                  : "Contest has ended"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterContestPage;