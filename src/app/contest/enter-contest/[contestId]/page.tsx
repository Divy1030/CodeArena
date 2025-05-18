"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

const EnterContestPage = () => {
  const params = useParams();
  const router = useRouter();
  const contestId = params?.contestId as string;
  const [contest, setContest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState("");
  const [timerLabel, setTimerLabel] = useState("");

  useEffect(() => {
    const fetchContest = async () => {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
      } catch (err) {
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
      if (now < start) {
        setTimerLabel("Contest starts in");
        setTimer(formatTime(start - now));
      } else if (now >= start && now < end) {
        setTimerLabel("Time left");
        setTimer(formatTime(end - now));
      } else {
        setTimerLabel("Contest Ended");
        setTimer("");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#1e293b] text-white py-10">
      <div className="bg-[#1e293b]/90 rounded-3xl shadow-2xl p-10 w-full max-w-5xl border-2 border-blue-700/60 backdrop-blur-md">
        {/* Timer at the top */}
        <div className="flex flex-col items-center mb-8">
          <span className="font-semibold text-lg text-blue-300">{timerLabel}</span>
          {timer && (
            <span className="text-4xl font-mono font-bold text-green-400">{timer}</span>
          )}
          {!timer && timerLabel === "Contest Ended" && (
            <span className="text-2xl font-bold text-red-400">Contest Ended</span>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-4xl font-extrabold mb-2 text-blue-400 tracking-tight drop-shadow-lg">{contest.title}</h2>
            <p className="text-lg text-gray-300 mb-2">{contest.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {contest.tags?.map((tag: string) => (
                <span key={tag} className="bg-blue-800/70 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide text-blue-200 shadow">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end mt-6 md:mt-0">
            <span className="text-sm text-gray-400">Contest ID:</span>
            <span className="text-xs text-gray-500 font-mono">{contest._id}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Organizer:</span>{" "}
              <span className="text-blue-300">{contest.organizer}</span>
            </div>
            <div>
              <span className="font-semibold">Moderators:</span>{" "}
              {contest.moderators && contest.moderators.length > 0
                ? contest.moderators.map((mod: string, idx: number) => (
                    <span key={mod} className="text-blue-300">
                      {mod}
                      {idx < contest.moderators.length - 1 ? ", " : ""}
                    </span>
                  ))
                : <span className="text-gray-400">None</span>}
            </div>
            <div>
              <span className="font-semibold">Start:</span>{" "}
              <span className="text-green-300">{new Date(contest.startTime).toLocaleString()}</span>
            </div>
            <div>
              <span className="font-semibold">End:</span>{" "}
              <span className="text-red-300">{new Date(contest.endTime).toLocaleString()}</span>
            </div>
            <div>
              <span className="font-semibold">Duration:</span>{" "}
              <span className="text-yellow-300">{contest.duration} minutes</span>
            </div>
            <div>
              <span className="font-semibold">Rated:</span>{" "}
              <span className={contest.isRated ? "text-green-400" : "text-gray-400"}>
                {contest.isRated ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Rules:</span>{" "}
              <span className="text-gray-200">{contest.rules}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Problems:</span>{" "}
              <span className="text-blue-200">{contest.problems?.length || 0}</span>
            </div>
            <div>
              <span className="font-semibold">Submissions:</span>{" "}
              <span className="text-blue-200">{contest.submissions?.length || 0}</span>
            </div>
            <div>
              <span className="font-semibold">Score:</span>{" "}
              <span className="text-green-300">{contest.score}</span>
            </div>
            <div>
              <span className="font-semibold">Attempts:</span>{" "}
              <span className="text-yellow-300">{contest.attempts}</span>
            </div>
            <div>
              <span className="font-semibold">Total Score:</span>{" "}
              <span className="text-green-300">{contest.totalScore}</span>
            </div>
            <div>
              <span className="font-semibold">Participants:</span>{" "}
              <span className="text-blue-200">{contest.participants?.length || 0}</span>
            </div>
            <div>
              <span className="font-semibold">Created At:</span>{" "}
              <span className="text-gray-400">{new Date(contest.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="font-semibold">Updated At:</span>{" "}
              <span className="text-gray-400">{new Date(contest.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
        {/* Start Contest Button */}
        {canStartContest() && (
          <div className="flex justify-center mt-8">
            <button
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-3 px-10 rounded-xl shadow-xl text-lg transition"
              onClick={() => router.push(`/contest/start-contest/${contestId}`)}
            >
              Start Contest
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterContestPage;