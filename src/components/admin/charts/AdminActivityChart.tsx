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

export const AdminActivityChart = () => {
  // Example data - in a real app, this would come from props or a backend call
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Contests Created',
        data: [1, 2, 1, 3, 2, 4],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Problems Added',
        data: [5, 7, 3, 12, 8, 15],
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