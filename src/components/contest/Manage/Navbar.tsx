import { useState } from 'react';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('Details');
  
  const tabs = [
    'Details',
    'Challenges',
    'Advanced Settings',
    'Moderators',
    'Notifications',
    'Signups',
    'Statistics'
  ];
  
  return (
    <div className="max-w-6xl mx-auto p-4 border border-gray-200 rounded-lg">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab
                ? 'text-gray-800 border-b-2 border-gray-800'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}