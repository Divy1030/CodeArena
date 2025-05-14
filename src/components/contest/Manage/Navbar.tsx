"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Details");
  const router = useRouter();
  const params = useParams();
  const contestId = params?.contestId as string;

  const tabs = [
    { name: "Details", route: "" },
    { name: "Challenges", route: "challenges" },
    { name: "Advanced Settings", route: "advance-settings" },
    { name: "Moderators", route: "moderators" },
    { name: "Notifications", route: "notifications" },
    { name: "Signups", route: "signups" },
    { name: "Statistics", route: "statistics" },
  ];

  const handleTabClick = (tab: { name: string; route: string }) => {
    setActiveTab(tab.name);
    router.push(`/contest/manage/${contestId}/${tab.route}`); // Update the route dynamically
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-[#1e293b] rounded-lg">
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab)}
            className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.name
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
}