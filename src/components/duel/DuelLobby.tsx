"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import socketService from "@/libs/socket";
import {
  startSearching,
  cancelSearching,
  setError,
  setQueuePosition,
} from "@/features/duel/slices/duelSlice";
import { RootState } from "@/store/store";
import { FaGamepad, FaSearch, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

export default function DuelLobby() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { matchmakingStatus, queuePosition, error, roomId, roomStatus, problemId, users } = useSelector(
    (state: RootState) => state.duel
  );
  const [searchTime, setSearchTime] = useState(0);
  
  // Track if we've already initiated navigation to prevent multiple redirects
  const hasNavigatedRef = useRef(false);

  // Redirect to match only when:
  // 1. We have a roomId
  // 2. Status is Live
  // 3. We have a problemId
  // 4. We have at least 2 users (properly paired)
  // 5. We haven't already navigated
  useEffect(() => {
    if (
      roomId && 
      roomStatus === "Live" && 
      problemId && 
      users.length >= 2 && 
      !hasNavigatedRef.current
    ) {
      hasNavigatedRef.current = true;
      router.push(`/duel/match/${roomId}`);
    }
  }, [roomId, roomStatus, problemId, users, router]);
  
  // Reset navigation flag when matchmaking status changes to idle or searching
  useEffect(() => {
    if (matchmakingStatus === "idle" || matchmakingStatus === "searching" || matchmakingStatus === "cancelled") {
      hasNavigatedRef.current = false;
    }
  }, [matchmakingStatus]);

  // Search timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (matchmakingStatus === "searching") {
      interval = setInterval(() => {
        setSearchTime((prev) => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }
    return () => clearInterval(interval);
  }, [matchmakingStatus]);

  const handleFindMatch = () => {
    dispatch(startSearching());
    socketService.findMatch((response) => {
      if (response.success) {
        if (response.status === "searching") {
          dispatch(setQueuePosition(response.queuePosition || 1));
          toast.success("Searching for opponent...");
        } else if (response.status === "matched") {
          toast.success("Match found!");
        }
      } else {
        dispatch(setError(response.message || "Failed to find match"));
        toast.error(response.message || "Failed to find match");
      }
    });
  };

  const handleCancelSearch = () => {
    socketService.cancelMatchmaking((response) => {
      dispatch(cancelSearching());
      if (response.success) {
        toast.success("Search cancelled");
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isSearching = matchmakingStatus === "searching";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1629] via-[#121B38] to-[#1a2547] flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ⚔️ Duel Arena
            </span>
          </h1>
          <p className="text-gray-400">
            Challenge opponents to real-time 1v1 coding battles
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#1a2547]/80 backdrop-blur-sm rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl">
          <div className="p-8">
            {!isSearching ? (
              // Find Match View
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <FaGamepad className="text-5xl text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Ready to Battle?
                  </h2>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto">
                    Find an opponent with similar rating and compete in a 30-minute
                    coding challenge. The best solution wins!
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleFindMatch}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-3 text-lg"
                  >
                    <FaSearch />
                    Find Match
                  </button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-[#0f1629]/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">30</p>
                    <p className="text-xs text-gray-400">Minutes</p>
                  </div>
                  <div className="bg-[#0f1629]/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">1v1</p>
                    <p className="text-xs text-gray-400">Battle</p>
                  </div>
                  <div className="bg-[#0f1629]/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">±200</p>
                    <p className="text-xs text-gray-400">Rating Range</p>
                  </div>
                </div>
              </div>
            ) : (
              // Searching View
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center relative">
                  <FaSearch className="text-4xl text-cyan-400" />
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Searching for Opponent...
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Looking for a player with similar rating
                  </p>
                </div>

                {/* Search Timer */}
                <div className="bg-[#0f1629]/50 rounded-xl p-6">
                  <p className="text-4xl font-mono font-bold text-cyan-400">
                    {formatTime(searchTime)}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Search Time</p>
                  {queuePosition && (
                    <p className="text-xs text-gray-500 mt-1">
                      Queue position: #{queuePosition}
                    </p>
                  )}
                </div>

                {/* Animated dots */}
                <div className="flex justify-center space-x-2">
                  <div
                    className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>

                <button
                  onClick={handleCancelSearch}
                  className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-red-500/30"
                >
                  <FaTimes />
                  Cancel Search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Timeout Message */}
        {matchmakingStatus === "timeout" && (
          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 text-center">
            No opponents found. Try again!
          </div>
        )}
      </div>
    </div>
  );
}
