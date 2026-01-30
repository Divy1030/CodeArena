"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import socketService from "@/libs/socket";
import {
  setError,
  setSubmissionResult,
  leaveMatch,
  setProblem as setProblemAction,
} from "@/features/duel/slices/duelSlice";
import { RootState } from "@/store/store";
import { Problem } from "@/features/duel/types/duel.types";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import {
  FaClock,
  FaPlay,
  FaSignOutAlt,
  FaTrophy,
  FaCode,
  FaChevronDown,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

interface DuelMatchArenaProps {
  roomId: string;
}

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", extension: ".js" },
  { id: "python", name: "Python", extension: ".py" },
  { id: "cpp", name: "C++", extension: ".cpp" },
  { id: "c", name: "C", extension: ".c" },
  { id: "java", name: "Java", extension: ".java" },
];

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// Write your solution here
function solve(input) {
  // Your code here
  return result;
}
`,
  python: `# Write your solution here
def solve(input):
    # Your code here
    return result
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}
`,
  c: `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}
`,
  java: `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}
`,
};

export default function DuelMatchArena({ roomId }: DuelMatchArenaProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    users,
    problemId,
    problem: reduxProblem,
    matchDuration,
    matchStartTime,
    roomStatus,
    submissionResult,
    opponentDisconnected,
  } = useSelector((state: RootState) => state.duel);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [language, setLanguage] = useState("javascript");
  const [timeLeft, setTimeLeft] = useState(matchDuration);
  const [submitting, setSubmitting] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [problemError, setProblemError] = useState<string | null>(null);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUserId(parsed._id || parsed.id);
    }
  }, []);

  // If no match data or not properly paired, try to get room status or redirect
  useEffect(() => {
    // Check if we don't have proper match data (no problem, not live, or not enough users)
    const isInvalidMatch = (!problemId && !reduxProblem) || roomStatus !== "Live" || users.length < 2;
    
    if (isInvalidMatch) {
      // No proper match data, try to get from socket after a short delay
      const timeout = setTimeout(() => {
        socketService.getRoomStatus(roomId, (response) => {
          if (!response.success || response.roomStatus !== "Live" || (response.users?.length || 0) < 2) {
            toast.error("Match not found or not properly paired");
            router.push("/duel");
          }
        });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [problemId, reduxProblem, roomStatus, users.length, roomId, router]);

  // Use problem from Redux if available, otherwise try to fetch
  useEffect(() => {
    // If problem is already in Redux state (from matchFound event), use it
    if (reduxProblem) {
      setProblem(reduxProblem);
      setLoadingProblem(false);
      setProblemError(null);
      return;
    }

    // If we don't have problemId yet, wait a bit for Redux to update
    if (!problemId) {
      // Wait briefly for Redux state to propagate
      const timeout = setTimeout(() => {
        if (!problemId && retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
        } else if (!problemId) {
          setLoadingProblem(false);
          setProblemError("No problem ID provided");
        }
      }, 500);
      return () => clearTimeout(timeout);
    }

    // Try to get problem from socket room status first
    const fetchFromSocket = () => {
      socketService.getRoomStatus(roomId, async (response) => {
        if (response.success && response.problemId) {
          // Socket doesn't return full problem, try API
          await fetchFromAPI();
        } else {
          await fetchFromAPI();
        }
      });
    };

    // Fetch problem from API
    const fetchFromAPI = async () => {
      try {
        setLoadingProblem(true);
        setProblemError(null);
        
        // Use Next.js API route instead of direct backend call
        const response = await axios.get(
          `/api/duel/problem/${problemId}`,
          { withCredentials: true }
        );
        
        if (response.data?.success && response.data?.data) {
          const fetchedProblem = response.data.data;
          setProblem(fetchedProblem);
          dispatch(setProblemAction(fetchedProblem)); // Store in Redux
        } else if (response.data?.data) {
          const fetchedProblem = response.data.data;
          setProblem(fetchedProblem);
          dispatch(setProblemAction(fetchedProblem)); // Store in Redux
        } else if (response.data && !response.data.success) {
          // If the API returns an error, retry if possible
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => setRetryCount(prev => prev + 1), 1000);
          } else {
            setProblemError(response.data.message || "Failed to load problem");
          }
        }
      } catch (err) {
        console.error("Failed to fetch problem:", err);
        if (retryCount < MAX_RETRIES) {
          // Retry after a delay
          setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        } else {
          const errorMessage = axios.isAxiosError(err) 
            ? err.response?.data?.message || "Problem not available - backend needs to expose problem endpoint"
            : "Failed to load problem";
          setProblemError(errorMessage);
        }
      } finally {
        setLoadingProblem(false);
      }
    };

    fetchFromSocket();
  }, [problemId, reduxProblem, dispatch, roomId, retryCount]);

  // Timer countdown
  useEffect(() => {
    if (!matchStartTime || roomStatus !== "Live") return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - matchStartTime;
      const remaining = Math.max(0, matchDuration - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [matchStartTime, matchDuration, roomStatus]);

  // Redirect when match is completed
  useEffect(() => {
    if (roomStatus === "completed") {
      router.push(`/duel/results/${roomId}`);
    }
  }, [roomStatus, roomId, router]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript({ jsx: false, typescript: false });
      case "python":
        return python();
      case "cpp":
      case "c":
        return cpp();
      case "java":
        return java();
      default:
        return javascript();
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage] || "");
    setShowLanguageDropdown(false);
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting");
      return;
    }

    setSubmitting(true);
    socketService.submitSolution(roomId, code, language, (response) => {
      setSubmitting(false);
      if (response.success) {
        dispatch(
          setSubmissionResult({
            score: response.score || 0,
            passedTestcases: response.passedTestcases || 0,
          })
        );
        toast.success(`Submitted! Score: ${response.score}`);
      } else {
        dispatch(setError(response.message || "Failed to submit"));
        toast.error(response.message || "Failed to submit");
      }
    });
  };

  const handleLeave = () => {
    if (
      confirm(
        "Are you sure you want to leave? You will forfeit the match."
      )
    ) {
      socketService.leaveMatch(roomId, () => {
        dispatch(leaveMatch());
        router.push("/duel");
      });
    }
  };

  const currentUserData = users.find((u) => u.userId === currentUserId);
  const hasSubmitted = currentUserData?.submissionStatus === "submitted";

  return (
    <div className="min-h-screen bg-[#0f1629] flex flex-col">
      {/* Opponent Status Banner */}
      {opponentDisconnected && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-2 text-center">
          <span className="text-yellow-400 flex items-center justify-center gap-2">
            <FaExclamationTriangle />
            Opponent disconnected. Waiting for reconnection...
          </span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#1a2547] border-b border-cyan-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white">⚔️ Duel Match</h1>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeLeft < 60000
                  ? "bg-red-500/20 text-red-400"
                  : "bg-cyan-500/20 text-cyan-400"
              }`}
            >
              <FaClock />
              <span className="font-mono font-bold text-lg">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Panel */}
        <div className="w-1/2 border-r border-cyan-500/20 overflow-y-auto">
          <div className="p-6">
            {loadingProblem ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : problemError ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaExclamationTriangle className="text-4xl text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Problem Not Available
                </h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  {problemError}
                </p>
                <p className="text-sm text-gray-500">
                  The backend may need to be configured to serve duel problems.
                  <br />
                  Problem ID: <code className="text-cyan-400">{problemId}</code>
                </p>
              </div>
            ) : problem ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {problem.title}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-400"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Description
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {problem.description}
                  </p>
                </div>

                {problem.inputFormat && (
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                      Input Format
                    </h3>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {problem.inputFormat}
                    </p>
                  </div>
                )}

                {problem.outputFormat && (
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                      Output Format
                    </h3>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {problem.outputFormat}
                    </p>
                  </div>
                )}

                {problem.constraints && (
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                      Constraints
                    </h3>
                    <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                      {problem.constraints}
                    </p>
                  </div>
                )}

                {problem.sampleInput && (
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                      Sample Input
                    </h3>
                    <pre className="bg-[#0f1629] p-4 rounded-lg text-gray-300 overflow-x-auto">
                      {problem.sampleInput}
                    </pre>
                  </div>
                )}

                {problem.sampleOutput && (
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                      Sample Output
                    </h3>
                    <pre className="bg-[#0f1629] p-4 rounded-lg text-gray-300 overflow-x-auto">
                      {problem.sampleOutput}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                Failed to load problem
              </div>
            )}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="bg-[#1a2547] border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#0f1629] border border-cyan-500/30 rounded-lg text-white hover:border-cyan-400 transition-colors"
              >
                <FaCode className="text-cyan-400" />
                <span>
                  {LANGUAGES.find((l) => l.id === language)?.name || language}
                </span>
                <FaChevronDown className="text-gray-400" />
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a2547] border border-cyan-500/30 rounded-lg shadow-xl z-10 overflow-hidden">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`w-full px-4 py-2 text-left hover:bg-cyan-500/20 transition-colors ${
                        language === lang.id
                          ? "text-cyan-400 bg-cyan-500/10"
                          : "text-white"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || hasSubmitted}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : hasSubmitted ? (
                <>
                  <FaTrophy />
                  <span>Submitted</span>
                </>
              ) : (
                <>
                  <FaPlay />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={code}
              height="100%"
              theme="dark"
              extensions={[getLanguageExtension()]}
              onChange={(value) => setCode(value)}
              className="h-full"
              style={{ height: "100%" }}
            />
          </div>

          {/* Submission Result */}
          {submissionResult && (
            <div className="bg-[#1a2547] border-t border-cyan-500/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FaTrophy className="text-yellow-400 text-xl" />
                  <div>
                    <p className="text-white font-semibold">
                      Your Score: {submissionResult.score}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Passed {submissionResult.passedTestcases} test cases
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scoreboard Sidebar */}
      <div className="fixed right-4 top-20 w-64 bg-[#1a2547]/95 backdrop-blur-sm border border-cyan-500/20 rounded-xl overflow-hidden shadow-xl">
        <div className="p-3 border-b border-cyan-500/20">
          <h3 className="text-sm font-semibold text-white flex items-center">
            <FaTrophy className="mr-2 text-yellow-400" />
            Live Scoreboard
          </h3>
        </div>
        <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
          {[...users]
            .sort((a, b) => b.score - a.score)
            .map((user, index) => (
              <div
                key={user.userId}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  user.userId === currentUserId
                    ? "bg-cyan-500/20 border border-cyan-500/30"
                    : "bg-[#0f1629]/50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm w-4">
                    #{index + 1}
                  </span>
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm truncate max-w-20">
                    {user.username}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-semibold text-sm">
                    {user.score}
                  </span>
                  {user.submissionStatus === "submitted" && (
                    <FaCheck className="text-green-400 text-xs" />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
