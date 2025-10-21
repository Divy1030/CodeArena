"use client";
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function ManageContestNavbar() {
  const pathname = usePathname();
  const params = useParams();
  const contestId = params?.contestId as string;

  const tabs = [
    { name: "Details", route: `/contest/manage/${contestId}` },
    { name: "Challenges", route: `/contest/manage/${contestId}/challenges` },
    { name: "Advanced Settings", route: `/contest/manage/${contestId}/advance-settings` },
    { name: "Moderators", route: `/contest/manage/${contestId}/moderators` },
    { name: "Notifications", route: `/contest/manage/${contestId}/notifications` },
    { name: "Signups", route: `/contest/manage/${contestId}/signups` },
    { name: "Statistics", route: `/contest/manage/${contestId}/statistics` },
  ];

  // Determine the active tab based on the current pathname
  const getActiveTab = () => {
    const exactMatch = tabs.find(tab => tab.route === pathname);
    if (exactMatch) return exactMatch.name;
    
    // Default to Details if no match or on the base route
    return "Details";
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTab());
  
  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [pathname, getActiveTab]); // Added getActiveTab to dependencies

  return (
    <div className="bg-[#121B38] border-b border-gray-700 overflow-x-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex border-b border-gray-700 whitespace-nowrap">
          {tabs.map((tab) => (
            <Link 
              href={tab.route} 
              key={tab.name}
              className={`px-4 sm:px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.name
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}