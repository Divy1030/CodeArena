"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import DuelLobby from "@/components/duel/DuelLobby";

export default function DuelPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { roomId, roomStatus } = useSelector((state: RootState) => state.duel);

  useEffect(() => {
    // Check authentication from localStorage (matching ProtectedRoute pattern)
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
    
    // Socket connection is handled by SocketProvider - no need to connect here
  }, [router]);

  // Redirect to existing match if user is already in one
  useEffect(() => {
    if (roomId && roomStatus === "Live") {
      router.push(`/duel/match/${roomId}`);
    } else if (roomId && roomStatus === "completed") {
      router.push(`/duel/results/${roomId}`);
    }
  }, [roomId, roomStatus, router]);

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

  return <DuelLobby />;
}
