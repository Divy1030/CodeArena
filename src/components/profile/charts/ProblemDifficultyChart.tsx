"use client";

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProblemDifficultyChartProps {
  solvedProblems: {
    difficulty: string;
  }[];
}

export const ProblemDifficultyChart: React.FC<ProblemDifficultyChartProps> = ({ solvedProblems }) => {
  const difficultyCounts = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  solvedProblems.forEach(problem => {
    const difficulty = problem.difficulty || 'Medium';
    if (difficulty in difficultyCounts) {
      difficultyCounts[difficulty as keyof typeof difficultyCounts]++;
    }
  });

  const data = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [difficultyCounts.Easy, difficultyCounts.Medium, difficultyCounts.Hard],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green for Easy
          'rgba(251, 191, 36, 0.8)',  // Yellow for Medium
          'rgba(239, 68, 68, 0.8)',   // Red for Hard
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          font: {
            size: 12
          },
          padding: 15,
        }
      },
      tooltip: {
        bodyColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return <Doughnut data={data} options={options} />;
};
