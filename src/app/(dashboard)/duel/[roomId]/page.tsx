"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SocketProvider, useSocket } from "@/components/SocketProvider";

function DuelRoom() {
  const { roomId } = useParams();
  const socket = useSocket();
  const [joinedRoom, setJoinedRoom] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [problemData, setProblemData] = useState<any>(null);
  const [status, setStatus] = useState<string>("waiting");
  const [code, setCode] = useState(""); // Set initial code template if you want
  const [language, setLanguage] = useState("python");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Join the room on mount
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit("joinCodingRoom", { roomId }, (res: any) => {
      if (res.success) {
        setJoinedRoom(res);
        setUsers(res.users);
        setProblemId(res.problemId);
        setStatus("waiting");
        setMessage("Joined room!");
      } else {
        setMessage(res.message);
        setTimeout(() => router.replace("/duel/lobby"), 2000);
      }
    });
  }, [socket, roomId, router]);

  // Listen for room updates and game events
  useEffect(() => {
    if (!socket) return;
    socket.on("roomUpdate", ({ users }: { users: any[] }) => setUsers(users));
    socket.on("matchStart", ({ users, problemId }) => {
      setUsers(users);
      setProblemId(problemId);
      setStatus("Live");
    });
    socket.on("matchFinished", ({ users }) => {
      setUsers(users);
      setStatus("finished");
    });
    socket.on("scoreUpdate", ({ users }) => setUsers(users));
    return () => {
      socket.off("roomUpdate");
      socket.off("matchStart");
      socket.off("matchFinished");
      socket.off("scoreUpdate");
    };
  }, [socket]);

  // Fetch problem data when problemId is available
  useEffect(() => {
    if (!problemId) return;
    const fetchProblem = async () => {
      try {
        const res = await fetch(`/api/problem/getProblemById/${problemId}`);
        const data = await res.json();
        setProblemData(data.data || null);
        // Optionally set initial code template based on language
        setCode(""); // Set your template here if needed
      } catch (error) {
        setProblemData(null);
      }
    };
    fetchProblem();
  }, [problemId]);

  // Submit solution
  const handleSubmit = () => {
    if (!socket || !roomId) return;
    socket.emit(
      "submitSolution",
      { roomId, code, language },
      (res: any) => {
        if (res.success) {
          setMessage("Solution submitted!");
        } else {
          setMessage(res.message);
        }
      }
    );
  };

  // UI
  if (!joinedRoom) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: 80, fontSize: 22, fontWeight: 600 }}>
        Joining room...
        <div style={{ color: "#facc15", marginTop: 18 }}>{message}</div>
      </div>
    );
  }

  if (!problemData) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: 80, fontSize: 22, fontWeight: 600 }}>
        Loading problem...
      </div>
    );
  }

  return (
    <div className="duel-room-bg" style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 20%, #23272f 60%, #11131a 100%)",
      padding: "40px 0"
    }}>
      {/* --- Problem Info --- */}
      <div style={{
        background: "#23272f",
        borderRadius: 12,
        maxWidth: 800,
        margin: "0 auto 24px auto",
        padding: 32,
        color: "#fff"
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{problemData.title}</h2>
        <div style={{ color: "#3b82f6", marginBottom: 8 }}>{problemData.difficulty}</div>
        <div style={{ marginBottom: 16 }}>{problemData.statement}</div>
        <div>
          <strong>Constraints:</strong>
          <ul>
            {(problemData.constraints || []).map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Examples:</strong>
          <ul>
            {(problemData.testCases || []).slice(0, 3).map((ex: any, i: number) => (
              <li key={i}>
                <div>Input: {ex.input}</div>
                <div>Output: {ex.output}</div>
                <div>Explanation: {ex.explanation}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Code Editor --- */}
      <div style={{
        background: "#181a20",
        borderRadius: 12,
        maxWidth: 800,
        margin: "0 auto",
        padding: 32,
        color: "#fff"
      }}>
        {/* Replace this with your CodeMirror or editor component */}
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{
            width: "100%",
            height: 200,
            background: "#23272f",
            color: "#fff",
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            fontFamily: "monospace"
          }}
        />
        <div style={{ marginTop: 16 }}>
          <button
            onClick={handleSubmit}
            style={{
              background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              cursor: "pointer",
              boxShadow: "0 2px 8px #06b6d488",
            }}
          >
            Submit Solution
          </button>
        </div>
        {message && <div style={{ color: "#facc15", marginTop: 18 }}>{message}</div>}
      </div>
    </div>
  );
}

export default function DuelRoomPage() {
  return (
    <SocketProvider>
      <DuelRoom />
    </SocketProvider>
  );
}