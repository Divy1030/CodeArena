import React from 'react';

interface Question {
  id: number;
  title: string;
  type: string;
}

interface QuestionRowProps {
  question: Question;
  onSolve: (question: Question) => void;
}

const QuestionRow: React.FC<QuestionRowProps> = ({ question, onSolve }) => {
  return (
    <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-800 transition-colors">
      <div className="col-span-7 text-white">
        {question.id}. {question.title}
      </div>
      <div className="col-span-3 text-gray-300">
        {question.type}
      </div>
      <div className="col-span-2">
        <button 
          onClick={() => onSolve(question)}
          className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
        >
          Solve
        </button>
      </div>
    </div>
  );
};

export default QuestionRow;