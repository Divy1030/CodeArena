"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/store/store";
import DuelMatchArena from "@/components/duel/DuelMatchArena";
import socketService from "@/libs/socket";
import { rejoinMatch, setError } from "@/features/duel/slices/duelSlice";

export default function DuelMatchPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const roomId = params.roomId as string;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { roomId: stateRoomId, roomStatus, problemId } = useSelector(
    (state: RootState) => state.duel
  );
  
  // Track if we've already attempted to rejoin to prevent duplicate calls
  const rejoinAttemptedRef = useRef(false);

  useEffect(() => {
    // Check authentication from localStorage
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
    
    // Socket connection is handled by SocketProvider
    // Wait for socket to be connected before attempting rejoin
    const checkSocketAndRejoin = () => {
      if (!socketService.isConnected()) {
        // If socket isn't connected yet, wait a bit and retry
        setTimeout(checkSocketAndRejoin, 100);
        return;
      }
      
      // If we don't have room data in state or it's a different room, attempt to rejoin
      // Only attempt once per roomId
      if ((!stateRoomId || stateRoomId !== roomId) && !rejoinAttemptedRef.current) {
        rejoinAttemptedRef.current = true;
        
        // Try to rejoin the match
        socketService.rejoinMatch(roomId, (response) => {
          if (response.success && response.roomId) {
            dispatch(
              rejoinMatch({
                roomId: response.roomId,
                problemId: response.problemId || "",
                users: response.users || [],
                roomStatus: response.roomStatus === "Live" ? "Live" : "completed",
                remainingTime: response.remainingTime || null,
              })
            );

            if (response.roomStatus === "completed") {
              router.push(`/duel/results/${roomId}`);
            }
            setLoading(false);
          } else {
            // Try getRoomStatus as fallback
            socketService.getRoomStatus(roomId, (statusResponse) => {
              if (statusResponse.success && statusResponse.roomId) {
                if (statusResponse.roomStatus === "Live") {
                  dispatch(
                    rejoinMatch({
                      roomId: statusResponse.roomId,
                      problemId: statusResponse.problemId || "",
                      users: statusResponse.users || [],
                      roomStatus: "Live",
                      remainingTime: null,
                    })
                  );
                  setLoading(false);
                } else if (statusResponse.roomStatus === "completed") {
                  router.push(`/duel/results/${roomId}`);
                } else {
                  dispatch(setError("Match not found"));
                  router.push("/duel");
                }
              } else {
                dispatch(setError(statusResponse.message || "Room not found"));
                router.push("/duel");
              }
            });
          }
        });
      } else if (stateRoomId === roomId) {
        // We already have the correct room data
        setLoading(false);
      }
    };
    
    checkSocketAndRejoin();
  }, [roomId, stateRoomId, router, dispatch]);

  // Reset rejoin flag if roomId changes
  useEffect(() => {
    rejoinAttemptedRef.current = false;
  }, [roomId]);

  // Redirect to results when match is completed
  useEffect(() => {
    if (roomStatus === "completed") {
      router.push(`/duel/results/${roomId}`);
    }
  }, [roomStatus, roomId, router]);

  if (loading || !problemId) {
    return (
      <div className="min-h-screen bg-[#0f1629] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <DuelMatchArena roomId={roomId} />;
}
