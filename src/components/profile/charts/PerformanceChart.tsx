"use client";

import React, { useEffect, useState } from 'react';
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

interface RatingPoint {
  contestTitle: string;
  date: string;
  score: number;
  rank?: number;
}

export const PerformanceChart = () => {
  const [ratingHistory, setRatingHistory] = useState<RatingPoint[]>([]);
  const [currentRating, setCurrentRating] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (!token) return;

        if (userData) {
          const parsed = JSON.parse(userData);
          setCurrentRating(parsed.rating || 1000);
        }

        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.success && result.data?.ratingHistory) {
          setRatingHistory(result.data.ratingHistory);
        }
      } catch (error) {
        console.error('Error fetching performance stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceStats();

    // Listen for user data updates
    const handleUpdate = () => fetchPerformanceStats();
    window.addEventListener('userDataUpdated', handleUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUpdate);
  }, []);

  // Build cumulative rating based on scores
  let cumulativeRating = 1000; // Starting rating
  const labels = ratingHistory.length > 0 
    ? ratingHistory.map(point => {
        const date = new Date(point.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      })
    : ['Start'];
  
  const ratingData = ratingHistory.length > 0
    ? ratingHistory.map(point => {
        // Simple rating change based on score (you can adjust this formula)
        cumulativeRating += Math.floor(point.score / 10);
        return cumulativeRating;
      })
    : [currentRating];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Rating',
        data: ratingData,
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          afterLabel: function(context: any) {
            const index = context.dataIndex;
            if (ratingHistory[index]) {
              return `Contest: ${ratingHistory[index].contestTitle}`;
            }
            return '';
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (ratingHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-400 mb-2">No contest history yet</div>
          <div className="text-2xl font-bold text-blue-400">{currentRating}</div>
          <div className="text-sm text-gray-500">Current Rating</div>
        </div>
      </div>
    );
  }

  return <Line options={options} data={data} />;
};