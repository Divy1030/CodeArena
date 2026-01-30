"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { resetDuel } from "@/features/duel/slices/duelSlice";
import { RootState } from "@/store/store";
import {
  FaTrophy,
  FaMedal,
  FaHome,
  FaRedo,
  FaCrown,
  FaStar,
  FaHandshake,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

interface DuelResultsProps {
  roomId: string;
}

export default function DuelResults({ roomId }: DuelResultsProps) {
  // roomId is passed for potential future use (e.g., fetching additional data)
  void roomId;
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { users, submissionResult, winner, isDraw, ratingChanges, matchEndReason } = useSelector(
    (state: RootState) => state.duel
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUserId(parsed._id || parsed.id);
    }
  }, []);

  // Sort users by score
  const sortedUsers = [...users].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // If scores are equal, earlier submission wins
    if (a.submissionTime && b.submissionTime) {
      return (
        new Date(a.submissionTime).getTime() -
        new Date(b.submissionTime).getTime()
      );
    }
    return 0;
  });

  const winnerUser = winner || sortedUsers[0];
  const currentUserRank =
    sortedUsers.findIndex((u) => u.userId === currentUserId) + 1;
  const isWinner = winnerUser?.userId === currentUserId;
  const currentUserData = users.find((u) => u.userId === currentUserId);

  // Winner celebration effect
  useEffect(() => {
    if (isWinner && typeof window !== "undefined") {
      console.log("🎉 Congratulations! You won!");
    }
  }, [isWinner]);

  const handlePlayAgain = () => {
    dispatch(resetDuel());
    router.push("/duel");
  };

  const handleGoHome = () => {
    dispatch(resetDuel());
    router.push("/user/home");
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-yellow-400 text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaMedal className="text-amber-600 text-xl" />;
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-500/20 to-gray-400/20 border-gray-500/30";
      case 3:
        return "bg-gradient-to-r from-amber-700/20 to-amber-600/20 border-amber-600/30";
      default:
        return "bg-[#0f1629]/50 border-cyan-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1629] via-[#121B38] to-[#1a2547] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Winner Announcement */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-2xl ${
              isDraw 
                ? "bg-gradient-to-br from-gray-500 to-gray-600 shadow-gray-500/30"
                : "bg-gradient-to-br from-yellow-500 to-amber-500 shadow-yellow-500/30"
            }`}>
              {isDraw ? (
                <FaHandshake className="text-5xl text-white" />
              ) : (
                <FaTrophy className="text-5xl text-white" />
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {isDraw ? "It's a Draw!" : isWinner ? "🎉 You Won! 🎉" : "Match Complete!"}
          </h1>
          {!isDraw && winnerUser && (
            <p className="text-xl text-gray-400">
              <span className="text-cyan-400 font-semibold">
                {winnerUser.username}
              </span>{" "}
              wins with{" "}
              <span className="text-yellow-400 font-semibold">
                {winnerUser.score} points
              </span>
            </p>
          )}
          {isDraw && (
            <p className="text-xl text-gray-400">
              Both players finished with the same score!
            </p>
          )}
          {matchEndReason === "forfeit" && (
            <p className="text-sm text-gray-500 mt-2">
              Match ended due to opponent forfeit
            </p>
          )}
          {matchEndReason === "timeout" && (
            <p className="text-sm text-gray-500 mt-2">
              Match ended - time limit reached
            </p>
          )}
        </div>

        {/* Your Result with Rating Change */}
        {currentUserRank > 0 && currentUserId && (
          <div
            className={`mb-6 p-6 rounded-2xl border ${
              isWinner
                ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
                : isDraw
                ? "bg-gradient-to-r from-gray-500/20 to-gray-400/20 border-gray-500/30"
                : "bg-[#1a2547]/80 border-cyan-500/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getRankIcon(currentUserRank)}
                <div>
                  <p className="text-lg font-semibold text-white">Your Result</p>
                  <p className="text-gray-400">
                    {isDraw ? "Draw" : `Rank #${currentUserRank}`} out of {sortedUsers.length} players
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-cyan-400">
                  {submissionResult?.score || currentUserData?.score || 0}
                </p>
                <p className="text-sm text-gray-400">points</p>
              </div>
            </div>
            {/* Rating Change Display */}
            {ratingChanges && currentUserId && ratingChanges[currentUserId] && (
              <div className="mt-4 pt-4 border-t border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Rating Change</p>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">
                      {ratingChanges[currentUserId].oldRating}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-white font-semibold">
                      {ratingChanges[currentUserId].newRating}
                    </span>
                    <span className={`flex items-center font-bold ${
                      ratingChanges[currentUserId].ratingChange >= 0 
                        ? "text-green-400" 
                        : "text-red-400"
                    }`}>
                      {ratingChanges[currentUserId].ratingChange >= 0 ? (
                        <FaArrowUp className="mr-1" />
                      ) : (
                        <FaArrowDown className="mr-1" />
                      )}
                      {ratingChanges[currentUserId].ratingChange >= 0 ? "+" : ""}
                      {ratingChanges[currentUserId].ratingChange}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-[#1a2547]/80 backdrop-blur-sm rounded-2xl border border-cyan-500/20 overflow-hidden mb-6">
          <div className="p-4 border-b border-cyan-500/20">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FaStar className="mr-2 text-yellow-400" />
              Final Leaderboard
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = user.userId === currentUserId;
              const userRatingChange = ratingChanges?.[user.userId];
              return (
                <div
                  key={user.userId}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${getRankBgColor(
                    rank
                  )} ${isCurrentUser ? "ring-2 ring-cyan-400" : ""}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 flex justify-center">
                      {getRankIcon(rank)}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium flex items-center">
                        {user.username}
                        {isCurrentUser && (
                          <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400">
                          Rating: {userRatingChange ? userRatingChange.newRating : user.rating}
                        </p>
                        {userRatingChange && (
                          <span className={`flex items-center text-xs font-medium ${
                            userRatingChange.ratingChange >= 0 
                              ? "text-green-400" 
                              : "text-red-400"
                          }`}>
                            {userRatingChange.ratingChange >= 0 ? (
                              <FaArrowUp className="mr-0.5" />
                            ) : (
                              <FaArrowDown className="mr-0.5" />
                            )}
                            {userRatingChange.ratingChange >= 0 ? "+" : ""}
                            {userRatingChange.ratingChange}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">
                      {user.score}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.submissionStatus === "submitted"
                        ? "Submitted"
                        : user.submissionStatus === "forfeited"
                        ? "Forfeited"
                        : "Not submitted"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleGoHome}
            className="flex-1 py-4 bg-[#1a2547] hover:bg-[#1a2547]/80 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-cyan-500/20"
          >
            <FaHome />
            Go Home
          </button>
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            <FaRedo />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
