"use client";
import React from 'react';
import { Settings, Clock } from 'lucide-react';

function page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="mb-6">
          <Settings className="w-24 h-24 text-gray-400 mx-auto mb-4" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Settings</h1>
        <p className="text-xl text-gray-600 mb-6">Under Development</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
}

export default page;