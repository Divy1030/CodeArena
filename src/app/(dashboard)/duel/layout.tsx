import React from "react";

export default function DuelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 20%, #23272f 60%, #11131a 100%)",
      fontFamily: "Inter, sans-serif"
    }}>
      <header style={{
        padding: "24px 0 8px 0",
        textAlign: "center",
        fontWeight: 800,
        fontSize: 32,
        color: "#3b82f6",
        letterSpacing: 1,
        textShadow: "0 2px 8px #0008"
      }}>
        ⚔️ CodeArena Duel
      </header>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 0" }}>
        {children}
      </main>
    </div>
  );
}