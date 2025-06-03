"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("Connecting to socket server at:", process.env.NEXT_PUBLIC_SOCKET_URL);
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      withCredentials: true, // This is required for cookies to be sent!
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  if (!socket) {
    console.log("Socket not connected yet");
    return <div style={{ color: "#fff" }}>Connecting to server...</div>;
  }

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}