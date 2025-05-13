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

export const PerformanceChart = () => {
  // Example data - in a real app, this would come from props or a backend call
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Rating',
        data: [1000, 1050, 1030, 1100, 1150, 1200],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.3,
      },
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