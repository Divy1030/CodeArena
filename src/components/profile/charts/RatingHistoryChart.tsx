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
  contests: {
    contestId: string;
    rank: number;
    score: number;
    contestName?: string;
  }[];
}

export const RatingHistoryChart: React.FC<RatingHistoryChartProps> = ({ contests }) => {
  const labels = contests.map((_, index) => `Contest ${index + 1}`);
  const scores = contests.map(c => c.score || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Score',
        data: scores,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
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
          label: function(context: any) {
            return `Score: ${context.parsed.y}`;
          }
        }
      }
    }
  };

  return <Line options={options} data={data} />;
};
