"use client";

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ContestDistributionChartProps {
  active: number;
  upcoming: number;
  past: number;
  total: number;
}

export const ContestDistributionChart: React.FC<ContestDistributionChartProps> = ({ 
  active, 
  upcoming, 
  past, 
  total 
}) => {
  const data = {
    labels: ['Active', 'Upcoming', 'Past'],
    datasets: [
      {
        data: [active, upcoming, past],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        bodyColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }
    }
  };

  return <Doughnut data={data} options={options} />;
};