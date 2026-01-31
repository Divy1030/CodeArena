"use client";

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RatingHistoryChartProps {
  ratingHistory?: {
    contestId: string;
    oldRating: number;
    newRating: number;
    ratingChange: number;
    rank: number;
    timestamp: string;
  }[];
}

export const RatingHistoryChart: React.FC<RatingHistoryChartProps> = ({ ratingHistory }) => {
  // If no rating history, show empty state
  if (!ratingHistory || ratingHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No rating history available
      </div>
    );
  }

  const labels = ratingHistory.map((_, index) => `Contest ${index + 1}`);
  const ratings = ratingHistory.map(r => r.newRating);
  
  // Create point colors based on rating change
  const pointColors = ratingHistory.map(r => {
    if (r.ratingChange > 0) return 'rgb(34, 197, 94)'; // green
    if (r.ratingChange < 0) return 'rgb(239, 68, 68)'; // red
    return 'rgb(156, 163, 175)'; // gray
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Rating',
        data: ratings,
        borderColor: 'rgb(147, 51, 234)', // purple
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        pointBorderWidth: 2,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        bodyColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          title: function(context: any) {
            return `Contest ${context[0].dataIndex + 1}`;
          },
          label: function(context: any) {
            const index = context.dataIndex;
            const entry = ratingHistory[index];
            return [
              `Rating: ${entry.newRating}`,
              `Change: ${entry.ratingChange >= 0 ? '+' : ''}${entry.ratingChange}`,
              `Rank: #${entry.rank}`
            ];
          }
        }
      }
    }
  };

  return <Line options={options} data={data} />;
};
