"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SocketProvider, useSocket } from "@/components/SocketProvider";

function Lobby() {
  const [players, setPlayers] = useState<any[]>([]);
  const [roomId, setRoomId] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [status, setStatus] = useState("waiting");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const socket = useSocket();

  // Join the lobby room on mount
  useEffect(() => {
    if (!socket) return;

    // Join the lobby (or a specific room if you want)
    socket.emit("joinLobby", {}, (res: any) => {
      if (res.success) {
        setPlayers(res.players || []);
        setRoomId(res.roomId || "");
        setIsCreator(res.isCreator || false);
        setStatus(res.status || "waiting");
      } else {
        setMessage(res.message || "Failed to join lobby");
      }
    });

    // Listen for player updates
    socket.on("lobbyUpdate", (data: any) => {
      setPlayers(data.players || []);
      setStatus(data.status || "waiting");
    });

    // Listen for game start
    socket.on("gameStarted", (data: any) => {
      router.replace(`/dashboard/duel/${data.roomId}`);
    });

    return () => {
      socket.off("lobbyUpdate");
      socket.off("gameStarted");
    };
  }, [socket, router]);

  // Start the game (only for creator)
  const handleStartGame = () => {
    if (!socket || !roomId) return;
    socket.emit("startGame", { roomId }, (res: any) => {
      if (!res.success) setMessage(res.message || "Failed to start game");
    });
  };

  return (
    <div style={{
      background: "rgba(30,34,44,0.98)",
      borderRadius: 18,
      boxShadow: "0 8px 32px #0007",
      padding: 40,
      width: 400,
      textAlign: "center",
      margin: "60px auto",
      color: "#fff"
    }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6", marginBottom: 24 }}>
        Duel Lobby
      </h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Room ID:</strong> <span style={{ color: "#06b6d4" }}>{roomId}</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Status:</strong> <span>{status === "waiting" ? "Waiting for players..." : status}</span>
      </div>
      <div style={{ marginBottom: 24 }}>
        <strong>Players:</strong>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {players.map((p, i) => (
            <li key={i} style={{ color: "#fff", margin: "6px 0" }}>
              {p.name || p.username || `Player ${i + 1}`} {p.isCreator && "(Host)"}
            </li>
          ))}
        </ul>
      </div>
      {isCreator && (
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
          onClick={handleStartGame}
          disabled={status !== "waiting" || players.length < 2}
        >
          Start Game
        </button>
      )}
      {message && <div style={{ color: "#f87171", marginTop: 12 }}>{message}</div>}
    </div>
  );
}

export default function DuelLobbyPage() {
  return (
    <SocketProvider>
      <Lobby />
    </SocketProvider>
  );
}