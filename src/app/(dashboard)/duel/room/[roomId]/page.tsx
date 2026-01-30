"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import socketService from "@/libs/socket";

/**
 * This page is deprecated in the new matchmaking flow.
 * It redirects users to the appropriate page based on the room status.
 */
export default function DuelRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication from localStorage
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    // Connect socket
    socketService.connect();

    // Check room status and redirect accordingly
    socketService.getRoomStatus(roomId, (response) => {
      setLoading(false);
      if (response.success && response.roomId) {
        if (response.roomStatus === "Live") {
          router.replace(`/duel/match/${roomId}`);
        } else if (response.roomStatus === "completed") {
          router.replace(`/duel/results/${roomId}`);
        } else {
          // No waiting rooms in new flow, redirect to lobby
          router.replace("/duel");
        }
      } else {
        router.replace("/duel");
      }
    });
  }, [roomId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1629] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking room status...</p>
        </div>
      </div>
    );
  }

  return null;
}
