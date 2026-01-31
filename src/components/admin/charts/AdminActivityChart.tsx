"use client";

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Contest {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  problems?: any[];
  createdAt?: string;
}

interface AdminActivityChartProps {
  contests: Contest[];
}

export const AdminActivityChart: React.FC<AdminActivityChartProps> = ({ contests }) => {
  // Get last 6 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const last6Months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    last6Months.push({
      month: months[date.getMonth()],
      year: date.getFullYear(),
      date: date
    });
  }
  
  const labels = last6Months.map(m => m.month);
  
  // Count contests created per month
  const contestsPerMonth = last6Months.map(monthData => {
    return contests.filter(contest => {
      const contestDate = new Date(contest.createdAt || contest.startTime);
      return contestDate.getMonth() === monthData.date.getMonth() &&
             contestDate.getFullYear() === monthData.date.getFullYear();
    }).length;
  });
  
  // Count problems added per month
  const problemsPerMonth = last6Months.map(monthData => {
    return contests
      .filter(contest => {
        const contestDate = new Date(contest.createdAt || contest.startTime);
        return contestDate.getMonth() === monthData.date.getMonth() &&
               contestDate.getFullYear() === monthData.date.getFullYear();
      })
      .reduce((sum, contest) => sum + (contest.problems?.length || 0), 0);
  });
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Contests Created',
        data: contestsPerMonth,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Problems Added',
        data: problemsPerMonth,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
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
        position: 'top' as const,
        labels: {
          color: 'white'
        }
      },
      tooltip: {
        bodyColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }
    }
  };

  return <Line options={options} data={data} />;
};