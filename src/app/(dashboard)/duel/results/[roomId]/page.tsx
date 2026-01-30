"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/store/store";
import DuelResults from "@/components/duel/DuelResults";
import socketService from "@/libs/socket";
import { matchCompleted } from "@/features/duel/slices/duelSlice";

export default function DuelResultsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const roomId = params.roomId as string;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { roomId: stateRoomId, users, roomStatus } = useSelector(
    (state: RootState) => state.duel
  );
  
  // Track if we've already attempted to fetch room status
  const fetchAttemptedRef = useRef(false);

  useEffect(() => {
    // Check authentication from localStorage
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
    
    // If we already have the data for this room, no need to fetch
    if (stateRoomId === roomId && users.length > 0 && roomStatus === "completed") {
      setLoading(false);
      return;
    }

    // Socket connection is handled by SocketProvider
    // Wait for socket to be connected before fetching
    const checkSocketAndFetch = () => {
      if (!socketService.isConnected()) {
        // If socket isn't connected yet, wait a bit and retry
        setTimeout(checkSocketAndFetch, 100);
        return;
      }
      
      // If we don't have room data in state or it's a different room, fetch it
      // Only attempt once per roomId
      if ((!stateRoomId || stateRoomId !== roomId || users.length === 0) && !fetchAttemptedRef.current) {
        fetchAttemptedRef.current = true;
        
        socketService.getRoomStatus(roomId, (response) => {
          if (response.success && response.roomId) {
            if (response.roomStatus === "completed") {
              // Determine winner from users
              const sortedUsers = [...(response.users || [])].sort((a, b) => b.score - a.score);
              const topScore = sortedUsers[0]?.score || 0;
              const topScorers = sortedUsers.filter(u => u.score === topScore);
              const isDraw = topScorers.length > 1;
              const winner = isDraw ? null : sortedUsers[0] || null;

              dispatch(
                matchCompleted({
                  users: response.users || [],
                  winner,
                  isDraw,
                })
              );
              setLoading(false);
            } else if (response.roomStatus === "Live") {
              router.push(`/duel/match/${roomId}`);
            } else {
              router.push("/duel");
            }
          } else {
            // Room not found - redirect to duel lobby
            router.push("/duel");
          }
        });
      } else if (stateRoomId === roomId && users.length > 0) {
        setLoading(false);
      }
    };
    
    checkSocketAndFetch();
  }, [roomId, stateRoomId, users.length, roomStatus, router, dispatch]);

  // Reset fetch flag if roomId changes
  useEffect(() => {
    fetchAttemptedRef.current = false;
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1629] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f1629] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return <DuelResults roomId={roomId} />;
}
