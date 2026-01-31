"use client";

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguageStats {
  [key: string]: number;
}

export const ProgrammingLanguageChart = () => {
  const [languageData, setLanguageData] = useState<LanguageStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguageStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.success && result.data?.languageUsage) {
          setLanguageData(result.data.languageUsage);
        }
      } catch (error) {
        console.error('Error fetching language stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguageStats();

    // Listen for user data updates
    const handleUpdate = () => fetchLanguageStats();
    window.addEventListener('userDataUpdated', handleUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUpdate);
  }, []);

  const colors = [
    { bg: 'rgba(54, 162, 235, 0.8)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(255, 206, 86, 0.8)', border: 'rgba(255, 206, 86, 1)' },
    { bg: 'rgba(75, 192, 192, 0.8)', border: 'rgba(75, 192, 192, 1)' },
    { bg: 'rgba(153, 102, 255, 0.8)', border: 'rgba(153, 102, 255, 1)' },
    { bg: 'rgba(255, 159, 64, 0.8)', border: 'rgba(255, 159, 64, 1)' },
    { bg: 'rgba(255, 99, 132, 0.8)', border: 'rgba(255, 99, 132, 1)' },
  ];

  const labels = Object.keys(languageData);
  const values = Object.values(languageData);
  
  const data = {
    labels: labels.length > 0 ? labels : ['No data'],
    datasets: [
      {
        label: 'Solutions',
        data: values.length > 0 ? values : [1],
        backgroundColor: labels.length > 0 ? labels.map((_, i) => colors[i % colors.length].bg) : ['rgba(128, 128, 128, 0.8)'],
        borderColor: labels.length > 0 ? labels.map((_, i) => colors[i % colors.length].border) : ['rgba(128, 128, 128, 1)'],
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">No solutions submitted yet</div>
      </div>
    );
  }

  return <Pie data={data} options={options} />;
};