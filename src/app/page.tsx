'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaInstagram, FaTwitter, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa';
import Image from "next/image";

// Placeholder components until you create the actual ones
const SpotlightComponent = () => <div className="py-20 bg-gray-900"></div>;
const SkillsSection = () => (
  <section className="py-20 bg-gray-800">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-10">Build Your Coding Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['Problem Solving', 'Algorithms', 'Data Structures'].map((skill) => (
          <div key={skill} className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">{skill}</h3>
            <p className="text-gray-300">Master essential skills through practical challenges and real-world problems.</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FocusOnCode = () => (
  <section className="py-20 bg-gray-900">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-10">Focus On Your Code</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        <pre className="text-green-400 overflow-x-auto">
          {`function solveChallenge(input) {
  // Your solution here
  return optimizedResult;
}`}
        </pre>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold">Code-Up</h3>
          <p className="text-gray-400 mt-2">Improve your coding skills through challenges</p>
        </div>
        <div className="flex space-x-6">
          <a href="https://www.instagram.com/codearena.csi/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl hover:text-blue-400" />
          </a>
          <a href="https://x.com/arena_code_csi" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-2xl hover:text-blue-400" />
          </a>
          <a href="mailto:codearena.csi@gmail.com">
            <FaEnvelope className="text-2xl hover:text-blue-400" />
          </a>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Code-Up. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Simple animation components
// const ShinyText = ({ text }) => {
//   return <span className="relative overflow-hidden">{text}</span>;
// };

// const FloatingDock = ({ items }) => {
//   return (
//     <div className="flex space-x-4">
//       {items.map((item, index) => (
//         <a 
//           key={index}
//           href={item.href}
//           target="_blank" 
//           rel="noopener noreferrer"
//           className="w-10 h-10 bg-gray-800 bg-opacity-80 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300"
//         >
//           {item.icon}
//         </a>
//       ))}
//     </div>
//   );
// };

// Simplified hyperspeed effect
const Hyperspeed = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-blue-950 to-black opacity-80"></div>
      {Array.from({ length: 50 }).map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.7,
            animation: `hyperspeed ${Math.random() * 3 + 2}s linear infinite`
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const dockItems = [
    { title: 'Instagram', href: 'https://www.instagram.com/codearena.csi/', icon: <FaInstagram /> },
    { title: 'Twitter', href: 'https://x.com/arena_code_csi', icon: <FaTwitter /> },
    { title: 'Gmail', href: 'mailto:codearena.csi@gmail.com', icon: <FaEnvelope /> },
  ];

  return (
    <div className={`relative min-h-screen w-full ${isDarkMode ? 'bg-black' : 'bg-[#0e054d]'}`}>
      <div className="absolute inset-0 z-0 h-full w-full">
        <Hyperspeed />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 text-left z-10 flex flex-col justify-center min-h-screen mr-0">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 bg-black dark:bg-gray-800 text-white dark:text-white p-2 rounded-full flex items-center justify-center"
        >
          {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-white" />}
        </button>
        <div className="flex flex-col items-start pt-16">
          <h1 className={`text-4xl md:text-6xl font-normal mb-8 text-white text-left`}>
            Enter the Arena, Unleash Your <br /> Coding Skills, and Conquer <br /> the Challenge.
          </h1>
          <p className={`text-lg md:text-xl mb-12 max-w-3xl text-white text-left`}>
            Join competitive coding contests and improve your <br /> programming
            skills through real-world challenges
          </p>
          <div className="flex flex-col md:flex-row gap-4 mb-20">
            <Link href="/register">
              <button className={`px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors`}>
                {/* <ShinyText text="Get Started →" /> */}
              </button>
            </Link>
          </div>
        </div>
        {/* <FloatingDock 
          className="z-10 inline-block"
          items={dockItems} 
        /> */}
      </div>
      <SkillsSection />
      <FocusOnCode />
      <Footer />
      
      <style jsx>{`
        @keyframes hyperspeed {
          0% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(calc(100vw - 100%)) translateY(calc(100vh - 100%)) scale(0.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
