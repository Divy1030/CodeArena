import React from 'react';
import { Clock, Trophy, Award } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface ProblemDisplayProps {
  contestId: string;
}

const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ contestId }) => {
  const { problemData } = useAppSelector(state => state.problem);

  if (!problemData) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="text-center">Loading problem...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 p-4 rounded-lg mb-4 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4 gap-2">
          <h1 className="text-xl font-semibold">{problemData.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-red-500 px-2 py-1 rounded text-sm bg-red-900">
              {problemData.difficulty}
            </span>
            <div className='flex items-center gap-1'>
              <Clock size={16} className="text-white" />
              <span className="text-gray-400">{problemData.timeEstimate}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Trophy size={16} className="text-white" />
              <span className="text-gray-400">{problemData.points} points</span>
            </div>
          </div>
        </div>

        <h2 className="font-semibold mb-2">Problem Description</h2>
        <p className="text-gray-400 mb-4">{problemData.description}</p>

        {problemData.examples.map((example, index) => (
          <div key={index}>
            <h3 className="font-semibold mb-2">Example {index + 1}:</h3>
            <div className="bg-gray-700 p-4 rounded mb-4">
              <p className="text-white">
                Input: {example.input}
                <br />
                Output: {example.output}
                <br />
                Explanation: {example.explanation}
              </p>
            </div>
          </div>
        ))}

        <h3 className="font-semibold mb-2">Constraints:</h3>
        <ul className="text-gray-400 list-disc pl-4 mb-4">
          {problemData.constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>

        {problemData.followUp && (
          <>
            <h3 className="font-semibold mb-2">Follow-up:</h3>
            <p className="text-gray-400 mb-4">{problemData.followUp}</p>
          </>
        )}
      </div>

      <div className="bg-gray-900 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-4">Weekly Contest #{contestId || '123'}</h2>
        <div className="flex justify-between gap-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-700 p-4 rounded-lg">
            <Award size={16} className="text-blue-400" />
            <div>
              <div className="text-sm text-white">Current Rank</div>
              <div className="text-xl font-bold">#42</div>
              <div className="text-sm text-white">out of 1,234 participants</div>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-gray-700 p-4 rounded-lg">
            <Trophy size={16} className="text-yellow-300" />
            <div>
              <div className="text-sm text-white">Total Score</div>
              <div className="text-xl font-bold">250</div>
              <div className="text-sm text-white">points earned</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemDisplay;