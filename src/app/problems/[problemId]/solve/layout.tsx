"use client";

import React from 'react';

interface SolveLayoutProps {
  children: React.ReactNode;
}

export default function SolveLayout({ children }: SolveLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Main content - no navbar (inherited from parent) and no footer for editor */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
