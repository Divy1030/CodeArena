"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import socketService from "@/libs/socket";
import {
  setError,
  leaveMatch,
  updateUsers,
  setOpponentDisconnected,
} from "@/features/duel/slices/duelSlice";
import { RootState } from "@/store/store";
import {
  FaUser,
  FaCopy,
  FaCheck,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import toast from "react-hot-toast";

interface DuelWaitingRoomProps {
  roomId: string;
}

export default function DuelWaitingRoom({ roomId }: DuelWaitingRoomProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    users,
    roomStatus,
    problemId,
    opponentDisconnected,
    remainingTime,
  } = useSelector((state: RootState) => state.duel);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rejoining, setRejoining] = useState(false);

  // Fetch room status on mount and set up event listeners
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket?.connected) {
      socketService.connect();
    }

    // Get current room status
    socketService.getRoomStatus(roomId, (response) => {
      setLoading(false);
      if (response.success && response.users) {
        dispatch(updateUsers(response.users));
      } else if (!response.success) {
        dispatch(setError(response.message || "Failed to get room status"));
        toast.error(response.message || "Room not found");
        router.push("/duel");
      }
    });

    // Set up event listeners
    socketService.onOpponentDisconnected((data) => {
      dispatch(setOpponentDisconnected(true));
      toast.error(`${data.username} disconnected`);
    });

    socketService.onOpponentReconnected((data) => {
      dispatch(setOpponentDisconnected(false));
      toast.success(`${data.username} reconnected`);
    });

    return () => {
      socketService.offOpponentDisconnected();
      socketService.offOpponentReconnected();
    };
  }, [roomId, dispatch, router]);

  // Redirect to match only when it's live, has a problem, and has 2 players (properly paired)
  useEffect(() => {
    if (roomStatus === "Live" && problemId && users.length >= 2) {
      router.push(`/duel/match/${roomId}`);
    }
  }, [roomStatus, problemId, users, roomId, router]);

  // Redirect to results if match is completed
  useEffect(() => {
    if (roomStatus === "completed") {
      router.push(`/duel/results/${roomId}`);
    }
  }, [roomStatus, roomId, router]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success("Room ID copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleLeaveMatch = useCallback(() => {
    socketService.leaveMatch(roomId, (response) => {
      dispatch(leaveMatch());
      router.push("/duel");
      if (response.success) {
        toast.success("Left the match");
      } else {
        toast.error(response.message || "Failed to leave match");
      }
    });
  }, [roomId, dispatch, router]);

  const handleRejoinMatch = useCallback(() => {
    setRejoining(true);
    socketService.rejoinMatch(roomId, (response) => {
      setRejoining(false);
      if (response.success) {
        if (response.users) {
          dispatch(updateUsers(response.users));
        }
        toast.success("Rejoined the match");
        if (response.roomStatus === "Live" && response.problemId) {
          router.push(`/duel/match/${roomId}`);
        }
      } else {
        dispatch(setError(response.message || "Failed to rejoin match"));
        toast.error(response.message || "Failed to rejoin match");
      }
    });
  }, [roomId, dispatch, router]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1629] via-[#121B38] to-[#1a2547] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading match...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1629] via-[#121B38] to-[#1a2547] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Match Room</h1>
          <p className="text-gray-400">
            {roomStatus === "Live"
              ? "Match in progress"
              : "Waiting for match to start..."}
          </p>
          {remainingTime !== null && remainingTime > 0 && (
            <p className="text-cyan-400 mt-2 text-lg font-mono">
              Time Remaining: {formatTime(remainingTime)}
            </p>
          )}
        </div>

        {/* Opponent Disconnected Warning */}
        {opponentDisconnected && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <FaExclamationTriangle className="text-yellow-400 text-xl flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-medium">
                Opponent Disconnected
              </p>
              <p className="text-yellow-400/70 text-sm">
                Waiting for them to reconnect...
              </p>
            </div>
          </div>
        )}

        {/* Room ID Card */}
        <div className="bg-[#1a2547]/80 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Match ID</p>
              <p className="text-xl font-mono font-bold text-cyan-400 tracking-wider">
                {roomId.length > 12 ? `${roomId.substring(0, 12)}...` : roomId}
              </p>
            </div>
            <button
              onClick={copyRoomId}
              className="p-4 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl transition-colors"
              title="Copy Match ID"
            >
              {copied ? (
                <FaCheck className="text-green-400 text-xl" />
              ) : (
                <FaCopy className="text-cyan-400 text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Players List */}
        <div className="bg-[#1a2547]/80 backdrop-blur-sm rounded-2xl border border-cyan-500/20 overflow-hidden mb-6">
          <div className="p-4 border-b border-cyan-500/20">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FaUser className="mr-2 text-cyan-400" />
              Players ({users.length})
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {users.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No players in this match...
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-4 bg-[#0f1629]/50 rounded-xl border border-cyan-500/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-sm text-gray-400">
                        Rating: {user.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.submissionStatus === "submitted"
                          ? "bg-green-500/20 text-green-400"
                          : user.submissionStatus === "forfeited"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-cyan-500/20 text-cyan-400"
                      }`}
                    >
                      {user.submissionStatus === "submitted"
                        ? "Submitted"
                        : user.submissionStatus === "forfeited"
                        ? "Forfeited"
                        : "Pending"}
                    </span>
                    {user.score > 0 && (
                      <p className="text-sm text-gray-400">
                        Score: {user.score}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleLeaveMatch}
            className="flex-1 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-red-500/30"
          >
            <FaSignOutAlt />
            Leave Match
          </button>
          <button
            onClick={handleRejoinMatch}
            disabled={rejoining}
            className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            {rejoining ? (
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
                Rejoining...
              </>
            ) : (
              <>
                <FaSync />
                Rejoin Match
              </>
            )}
          </button>
        </div>

        {/* Waiting Animation */}
        {roomStatus !== "Live" && roomStatus !== "completed" && (
          <div className="mt-6 text-center">
            <p className="text-gray-400">Preparing match...</p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
