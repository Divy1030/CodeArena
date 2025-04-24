import React, { JSX } from 'react';
import { FaJs, FaPython, FaCuttlefish } from 'react-icons/fa';
import { CiUser } from 'react-icons/ci';

// Define the language options
type LanguageKey = 'js' | 'python' | 'c';

// Define the difficulty options
type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | string;

// Define props interface
interface ContestCardProps {
  title?: string;
  difficulty?: DifficultyLevel;
  participants?: number;
  languages?: LanguageKey[];
  onClick?: () => void;
  isPrevious?: boolean; // Add this line
}

// Define language logos with proper typing
const languageLogos: Record<LanguageKey, JSX.Element> = {
  js: <FaJs className="w-6 h-6 text-[#B0B3C3]" />, // JavaScript logo
  python: <FaPython className="w-6 h-6 text-[#B0B3C3]" />, // Python logo
  c: <FaCuttlefish className="w-6 h-6 text-[#B0B3C3]" />, // C logo
};

const ContestCard: React.FC<ContestCardProps> = ({ 
  title = 'Weekly Challenge #45', 
  difficulty = 'Medium', 
  participants = 234,
  languages = ['js', 'python', 'c'],
  onClick,
  isPrevious = false // Add default value
}) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-[#4A55A2] rounded-lg p-4 flex flex-col justify-between h-48 min-w-60 shadow-md hover:shadow-lg transition-shadow ${isPrevious ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-semibold mb-2">{title}</h3>
          <div className="text-white text-sm mb-2 flex items-center">
            <CiUser className="w-5 h-5 mr-2" />{participants} participants
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex space-x-2">
          {languages.map((lang) => (
            <div key={lang} className="w-6 h-6">
              {languageLogos[lang]}
            </div>
          ))}
        </div>
        <button 
          onClick={onClick}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          {isPrevious ? 'View Results' : 'Join Now'}
        </button>
      </div>
    </div>
  );
};

export default ContestCard;