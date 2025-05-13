"use client";

import React from 'react';
import { CalendarClock, Clock, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContestCardProps {
  id?: string;
  title?: string;
  date?: string;
  time?: string;
  participants?: number;
  isPrevious?: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

const ContestCard: React.FC<ContestCardProps> = ({
  id = "contest-123", // Default ID for demo
  title = "Algorithm Challenge",
  date = "April 30, 2025",
  time = "2 hours",
  participants = 230,
  isPrevious = false,
  difficulty = "Easy",
}) => {
  const router = useRouter();

  // Get background color based on difficulty
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Hard':
        return 'bg-red-600';
      case 'Medium':
        return 'bg-orange-500';
      case 'Easy':
        return 'bg-green-600';
      default:
        return 'bg-green-600';
    }
  };

  const handleCardClick = () => {
    if (isPrevious) {
      // For previous contests, we can show results (if that page exists)
      router.push(`/contest/results?id=${id}`);
    } else {
      // For active contests, go to your existing problem page
      router.push(`/contest/problem?id=${id}`);
    }
  };

  return (
    <div 
      className="bg-[#0d1538] rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-105"
      onClick={handleCardClick}
    >
      <div className={`p-4 ${isPrevious ? 'opacity-80' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <span className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor()}`}>
            {difficulty}
          </span>
        </div>

        <div className="flex flex-col space-y-2 text-gray-300 mb-6">
          <div className="flex items-center">
            <CalendarClock size={18} className="mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock size={18} className="mr-2" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <Trophy size={18} className="mr-2" />
            <span>{participants} participants</span>
          </div>
        </div>

        <div className="mt-4">
          <button 
            className={`w-full py-2 rounded-md text-white font-medium ${
              isPrevious 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-[#0169FF] hover:bg-blue-600'
            } transition-colors`}
          >
            {isPrevious ? 'View Results' : 'Join Contest'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;