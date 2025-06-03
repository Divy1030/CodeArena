"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SocketProvider, useSocket } from "@/components/SocketProvider";

function CreateOrJoinRoom() {
  const socket = useSocket();
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreate = () => {
    if (!socket) return;
    setCreateLoading(true);
    socket.emit("createRoom", (res: any) => {
      setCreateLoading(false);
      if (res.success) {
        router.replace(`/duel/${res.roomId}`);
      } else {
        alert(res.message);
      }
    });
  };

  const handleJoin = () => {
    if (!socket || !roomId) return;
    setLoading(true);
    socket.emit("joinCodingRoom", { roomId }, (res: any) => {
      setLoading(false);
      if (res.success) {
        router.replace(`/duel/${roomId}`);
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <div
      style={{
        background: "rgba(30,34,44,0.98)",
        borderRadius: 18,
        boxShadow: "0 8px 32px #0007",
        padding: 40,
        width: 400,
        textAlign: "center",
        margin: "60px auto",
        color: "#fff",
      }}
    >
      <h2
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#3b82f6",
          marginBottom: 24,
        }}
      >
        Create or Join a Duel Room
      </h2>
      <button
        style={{
          background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          border: "none",
          borderRadius: 8,
          padding: "12px 32px",
          marginBottom: 18,
          cursor: "pointer",
          boxShadow: "0 2px 8px #06b6d488",
          width: "100%",
        }}
        onClick={handleCreate}
        disabled={createLoading}
      >
        {createLoading ? "Creating..." : "Create New Room"}
      </button>
      <div
        style={{
          margin: "18px 0",
          color: "#aaa",
          fontWeight: 500,
        }}
      >
        or
      </div>
      <input
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{
          padding: "10px 16px",
          borderRadius: 6,
          border: "1px solid #3b82f6",
          background: "#23272f",
          color: "#fff",
          fontSize: 16,
          marginRight: 8,
          outline: "none",
          width: "70%",
        }}
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        disabled={loading}
      />
      <button
        style={{
          background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          border: "none",
          borderRadius: 8,
          padding: "10px 22px",
          cursor: "pointer",
          boxShadow: "0 2px 8px #3b82f688",
          marginTop: 12,
          width: "100%",
        }}
        onClick={handleJoin}
        disabled={loading || !roomId}
      >
        {loading ? "Joining..." : "Join Room"}
      </button>
    </div>
  );
}

export default function CreateOrJoinRoomPage() {
  return (
    <SocketProvider>
      <CreateOrJoinRoom />
    </SocketProvider>
  );
}