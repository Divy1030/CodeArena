"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
// import Image from "next/image";
import RotatingText from "@/components/bits/RotatingText";
// import Hyperspeed from "@/components/bits/HyperSpeed";

// Updated SkillsSection with integrated RotatingText
const SkillsSection = () => (
  <section className="py-20 bg-gray-800">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-10 flex items-center">
        Build Your{" "}
        <span className="ml-2 inline-flex">
          <RotatingText
            texts={["Problem Solving", "Coding", "Algorithm", "Development"]}
            mainClassName="bg-cyan-300 text-black overflow-hidden py-0.5 px-2 rounded-lg mx-2"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </span>{" "}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {["Problem Solving", "Algorithms", "Data Structures"].map((skill) => (
          <div key={skill} className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">{skill}</h3>
            <p className="text-gray-300">
              Master essential skills through practical challenges and
              real-world problems.
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FocusOnCode = () => (
  <section className="py-20 bg-gray-900">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-10">
        Focus On Your Code
      </h2>
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

export default function Home() {
  // State for hyperspeed effect speed control
  const [, setIsHyperspeedFast] = useState(false);

  // Handle mouse events for speed boost
  const handleSpeedUp = () => {
    setIsHyperspeedFast(true);
  };

  const handleSlowDown = () => {
    setIsHyperspeedFast(false);
  };

  // Custom hyperspeed options
  // const hyperspeedOptions = {
  //   fov: 90,
  //   fovSpeedUp: 140,
  //   speedUp: 3,
  //   colors: {
  //     roadColor: 0x080830,
  //     islandColor: 0x0a0a3a,
  //     background: 0x000022,
  //     shoulderLines: 0x4040ff,
  //     brokenLines: 0x4040ff,
  //     leftCars: [0x4444ff, 0x4444ff, 0x4444ff],
  //     rightCars: [0x4040cc, 0x3030cc, 0x2020cc],
  //     sticks: 0x4040cc,
  //   },
  //   isHyper: isHyperspeedFast,
  //   onSpeedUp: handleSpeedUp,
  //   onSlowDown: handleSlowDown,
  // };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Use the Navbar component */}
      <Navbar isAuthenticated={false} isAdmin={false} />

      {/* Hero Section with Hyperspeed */}
      <div className="relative bg-black h-[100vh] overflow-hidden">
        {/* Hyperspeed effect container */}
        <div className="absolute inset-0 z-0 h-full w-full opacity-70">
          {/* <Hyperspeed effectOptions={hyperspeedOptions} /> */}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-left z-10 flex flex-col justify-center h-full">
          <div className="flex flex-col items-start pt-16">
            <h1 className="text-4xl md:text-6xl font-normal mb-8 text-white text-left">
              Enter the Arena, Unleash Your <br /> Coding Skills, and Conquer{" "}
              <br /> the Challenge.
            </h1>
            <p className="text-lg md:text-xl mb-12 max-w-3xl text-white text-left">
              Join competitive coding contests and improve your <br />{" "}
              programming skills through real-world challenges
            </p>
            <div className="flex flex-col md:flex-row gap-4 mb-20">
              <Link href="/register">
                <button
                  className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onMouseEnter={handleSpeedUp}
                  onMouseLeave={handleSlowDown}
                  onTouchStart={handleSpeedUp}
                  onTouchEnd={handleSlowDown}
                >
                  Get Started →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <SkillsSection />
      <FocusOnCode />

      {/* Use the Footer component */}
      <Footer />
    </div>
  );
}
