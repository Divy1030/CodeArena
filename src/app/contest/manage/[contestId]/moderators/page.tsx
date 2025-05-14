"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";

function ModeratorsPage() {
  const params = useParams();
  const contestId = params?.contestId as string;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/contest/add-moderators/${contestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(email ? { email } : {}),
          ...(username ? { username } : {}),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Moderator added successfully!");
        setEmail("");
        setUsername("");
      } else {
        setMessage(data.message || "Failed to add moderator.");
      }
    } catch (err) {
      setMessage("Error adding moderator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex flex-col items-center justify-center py-10 text-white">
      <div className="bg-[#1e293b]/90 rounded-2xl shadow-2xl p-10 w-full max-w-md border border-blue-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Add Moderator</h2>
        <form onSubmit={handleAddModerator} className="flex flex-col gap-5">
          <input
            className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Moderator Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!!username}
          />
          <div className="text-center text-gray-400">or</div>
          <input
            className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Moderator Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={!!email}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 mt-2"
            disabled={loading || (!email && !username)}
          >
            {loading ? "Adding..." : "Add Moderator"}
          </button>
        </form>
        {message && (
          <div className={`mt-4 text-center font-semibold ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModeratorsPage;