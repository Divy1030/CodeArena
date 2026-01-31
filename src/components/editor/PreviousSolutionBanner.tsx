import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PreviousSolutionBannerProps {
  userSolution: {
    solutionCode?: string;
    languageUsed?: string;
    score?: number;
    timeOccupied?: number;
    memoryOccupied?: number;
  };
  maxScore: number;
}

const PreviousSolutionBanner: React.FC<PreviousSolutionBannerProps> = ({ userSolution, maxScore }) => {
  const isPerfectScore = userSolution.score === maxScore;
  const scorePercentage = maxScore > 0 ? Math.round((userSolution.score || 0) / maxScore * 100) : 0;

  return (
    <div className={`mb-4 p-4 rounded-lg border-2 ${
      isPerfectScore 
        ? 'bg-green-900/20 border-green-600' 
        : 'bg-yellow-900/20 border-yellow-600'
    }`}>
      <div className="flex items-center gap-3">
        {isPerfectScore ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <XCircle className="w-6 h-6 text-yellow-500" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-white">
            {isPerfectScore ? 'Previously Solved!' : 'Partial Solution Found'}
          </h3>
          <div className="text-sm text-gray-300 mt-1">
            <span>Score: <span className="font-bold">{userSolution.score}/{maxScore}</span> ({scorePercentage}%)</span>
            {userSolution.languageUsed && (
              <span className="ml-4">Language: <span className="font-semibold">{userSolution.languageUsed}</span></span>
            )}
          </div>
          {userSolution.timeOccupied !== undefined && userSolution.memoryOccupied !== undefined && (
            <div className="text-xs text-gray-400 mt-1">
              Runtime: {userSolution.timeOccupied}ms | Memory: {userSolution.memoryOccupied}KB
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {isPerfectScore 
          ? 'Your previous solution passed all test cases. You can improve your solution or move to the next problem.'
          : 'Your previous submission had partial success. Try to improve your solution to get full marks!'}
      </p>
    </div>
  );
};

export default PreviousSolutionBanner;
