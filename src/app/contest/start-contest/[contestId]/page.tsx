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

const StartContestPage = () => {
  const params = useParams();
  const router = useRouter();
  const contestId = params?.contestId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contest, setContest] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const startContest = async () => {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`/api/contest/start-contest/${contestId}`, {
          method: "GET",
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setContest(data.data[0]);
        } else {
          setError(data.message || "Failed to start contest.");
        }
      } catch (err) {
        setError("Error starting contest.");
      } finally {
        setLoading(false);
      }
    };
    if (contestId) startContest();
  }, [contestId]);

  // Timer for time left till contest end
  useEffect(() => {
    if (!contest) return;
    const end = new Date(contest.endTime).getTime();

    const updateTimeLeft = () => {
      const now = Date.now();
      setTimeLeft(formatTime(end - now));
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400"></div>
        <span className="ml-4 text-xl font-semibold mt-4 animate-pulse">Starting contest...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-red-400">
        <div className="bg-[#1e293b] rounded-2xl px-10 py-8 shadow-2xl border border-red-700 animate-fade-in">
          <span className="text-2xl font-bold">{error}</span>
        </div>
      </div>
    );
  }

  if (!contest) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#1e293b] text-white py-10">
      <div className="bg-[#1e293b]/90 rounded-3xl shadow-2xl p-10 w-full max-w-5xl border-2 border-green-700/60 backdrop-blur-md animate-fade-in">
        {/* Timer at the top */}
        <div className="flex flex-col items-center mb-8">
          <span className="font-semibold text-lg text-blue-300">Time Left</span>
          <span className="text-4xl font-mono font-bold text-green-400 transition-all duration-500">{timeLeft}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-4xl font-extrabold mb-2 text-green-400 tracking-tight drop-shadow-lg transition-all duration-300 hover:scale-105">{contest.title}</h2>
            <p className="text-lg text-gray-300 mb-2">{contest.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {contest.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-blue-800/70 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide text-blue-200 shadow transition-all duration-200 hover:bg-blue-700 hover:scale-105"
                >
                  {tag}
                </span>
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
              <span className="font-semibold">Participants:</span>{" "}
              <span className="text-blue-200">{contest.participants?.length || 0}</span>
            </div>
            <div>
              <span className="font-semibold">Problems:</span>{" "}
              <span className="text-blue-200">{contest.problems?.length || 0}</span>
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
              <span className="font-semibold">Created At:</span>{" "}
              <span className="text-gray-400">{new Date(contest.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="font-semibold">Updated At:</span>{" "}
              <span className="text-gray-400">{new Date(contest.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
        {/* Problems List */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-blue-400 mb-6 underline underline-offset-4 decoration-blue-600">Problems</h3>
          {contest.problems && contest.problems.length > 0 ? (
            <div className="grid gap-4">
              {contest.problems.map((problem: any, index: number) => (
                <div
                  key={problem._id}
                  className="group bg-[#1e293b] rounded-lg p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-600 border border-transparent cursor-pointer relative"
                  onClick={() => {
                    const problemData = encodeURIComponent(JSON.stringify({
                      id: problem._id,
                      title: problem.title,
                      difficulty: problem.difficulty,
                      statement: problem.statement,
                      testCases: problem.testCases || []
                    }));
                    router.push(
                      `/contest/editor/${contestId}/${problem._id}?problemData=${problemData}`
                    );
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg group-hover:text-blue-400 transition-colors duration-200">
                        {String.fromCharCode(65 + index)}. {problem.title}
                      </h3>
                      <span className={`text-xs rounded px-2 py-0.5 mt-1 inline-block transition-all duration-200 ${
                        problem.difficulty?.toLowerCase() === 'easy' ? 'bg-green-500 text-white group-hover:bg-green-600' :
                        problem.difficulty?.toLowerCase() === 'hard' ? 'bg-red-500 text-white group-hover:bg-red-600' :
                        'bg-yellow-500 text-black group-hover:bg-yellow-600'
                      }`}>
                        {problem.difficulty || 'Medium'}
                      </span>
                    </div>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg"
                      onClick={e => {
                        e.stopPropagation();
                        const problemData = encodeURIComponent(JSON.stringify({
                          id: problem._id,
                          title: problem.title,
                          difficulty: problem.difficulty,
                          statement: problem.statement,
                          testCases: problem.testCases || []
                        }));
                        router.push(
                          `/contest/editor/${contestId}/${problem._id}?problemData=${problemData}`
                        );
                      }}
                    >
                      Solve
                    </button>
                  </div>
                  <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-10 bg-blue-400 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">No problems found.</div>
          )}
        </div>
        <div className="flex justify-center mt-12">
          <button
            className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-3 px-10 rounded-xl shadow-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-bounce-slow"
            onClick={() => router.push(`/user/contest/${contestId}`)}
          >
            Go to Contest
          </button>
        </div>
      </div>
      {/* Custom fade-in and bounce animation styles */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
      `}</style>
    </div>
  );
};

export default StartContestPage;