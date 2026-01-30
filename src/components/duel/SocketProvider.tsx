"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import socketService, {
  MatchFoundData,
  ScoreUpdateData,
  SubmissionUpdateData,
  MatchFinishedData,
  OpponentLeftData,
  OpponentDisconnectedData,
} from "@/libs/socket";
import {
  matchFound,
  updateUsers,
  matchCompleted,
  opponentLeft,
  setOpponentDisconnected,
  setOpponentSubmitting,
  matchmakingTimeout,
  setError,
} from "@/features/duel/slices/duelSlice";
import toast from "react-hot-toast";

interface SocketProviderProps {
  children: React.ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Track if listeners are already set up to prevent duplicate registrations
  const listenersSetUpRef = useRef(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    setIsAuthenticated(!!token && !!userData);
  }, []);

  // Set up socket connection and event listeners - only once when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      socketService.disconnect();
      listenersSetUpRef.current = false;
      return;
    }

    // Connect socket
    socketService.connect();

    // Only set up listeners once
    if (listenersSetUpRef.current) {
      return;
    }
    
    listenersSetUpRef.current = true;

    // Handle match found
    socketService.onMatchFound((data: MatchFoundData) => {
      console.log("Match found:", data);
      dispatch(
        matchFound({
          roomId: data.roomId,
          problemId: data.problemId,
          problem: data.problem ? {
            _id: data.problem._id,
            title: data.problem.title,
            description: data.problem.description,
            difficulty: data.problem.difficulty,
            inputFormat: data.problem.inputFormat,
            outputFormat: data.problem.outputFormat,
            constraints: data.problem.constraints,
            examples: data.problem.examples,
          } : undefined,
          users: data.users,
          duration: data.duration,
          startedAt: data.startedAt,
          endsAt: data.endsAt,
        })
      );
      toast.success(data.message || "Match found!");
    });

    // Handle matchmaking timeout
    socketService.onMatchmakingTimeout((data: { message: string }) => {
      console.log("Matchmaking timeout:", data);
      dispatch(matchmakingTimeout());
      toast.error(data.message || "No match found. Please try again.");
    });

    // Handle matchmaking error
    socketService.onMatchmakingError((data: { message: string }) => {
      console.log("Matchmaking error:", data);
      dispatch(setError(data.message));
      toast.error(data.message || "Matchmaking error");
    });

    // Handle score update
    socketService.onScoreUpdate((data: ScoreUpdateData) => {
      console.log("Score update:", data);
      dispatch(updateUsers(data.users));
    });

    // Handle submission update
    socketService.onSubmissionUpdate((data: SubmissionUpdateData) => {
      console.log("Submission update:", data);
      dispatch(setOpponentSubmitting(false));
      toast(`${data.username} submitted! Score: ${data.score}`, { icon: "📝" });
    });

    // Handle user submitting
    socketService.onUserSubmitting((data: { userId: string; username: string }) => {
      console.log("User submitting:", data);
      dispatch(setOpponentSubmitting(true));
    });

    // Handle match finished
    socketService.onMatchFinished((data: MatchFinishedData) => {
      console.log("Match finished:", data);
      dispatch(
        matchCompleted({
          users: data.users,
          winner: data.winner,
          isDraw: data.isDraw,
          ratingChanges: data.ratingChanges,
          reason: data.reason,
        })
      );
    });

    // Handle opponent left
    socketService.onOpponentLeft((data: OpponentLeftData) => {
      console.log("Opponent left:", data);
      dispatch(
        opponentLeft({
          matchEnded: data.matchEnded,
          winner: data.winner,
          ratingChanges: data.ratingChanges,
        })
      );
      toast(`${data.username} left the match`, { icon: "🚪" });
    });

    // Handle opponent disconnected
    socketService.onOpponentDisconnected((data: OpponentDisconnectedData) => {
      console.log("Opponent disconnected:", data);
      dispatch(setOpponentDisconnected(true));
      toast(data.message, { icon: "⚠️" });
    });

    // Handle opponent reconnected
    socketService.onOpponentReconnected((data: { userId: string; username: string }) => {
      console.log("Opponent reconnected:", data);
      dispatch(setOpponentDisconnected(false));
      toast.success(`${data.username} reconnected!`);
    });

    return () => {
      socketService.removeAllListeners();
      listenersSetUpRef.current = false;
    };
  }, [isAuthenticated, dispatch]);

  return <>{children}</>;
}
