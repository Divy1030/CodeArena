"use client";

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SubmissionActivityChartProps {
  submissions: {
    status: string;
    createdAt: string;
  }[];
}

export const SubmissionActivityChart: React.FC<SubmissionActivityChartProps> = ({ submissions }) => {
  // Get last 7 days
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }

  const labels = days.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  
  const submissionsPerDay = days.map(day => {
    return submissions.filter(sub => {
      const subDate = new Date(sub.createdAt);
      return subDate.toDateString() === day.toDateString();
    }).length;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Submissions',
        data: submissionsPerDay,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: 'rgba(255, 255, 255, 0.8)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
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
      }
    }
  };

  return <Bar options={options} data={data} />;
};
