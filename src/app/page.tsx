"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import RotatingText from "@/components/bits/RotatingText";

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
            width: Math.random() * 3 + "px",
            height: Math.random() * 3 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            opacity: Math.random() * 0.7,
            animation: `hyperspeed ${Math.random() * 3 + 2}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Use the Navbar component */}
      <Navbar isAuthenticated={false} isAdmin={false} />
      
      {/* Hero Section */}
      <div className="relative bg-black min-h-screen">
        <div className="absolute inset-0 z-0 h-full w-full">
          {/* Uncomment to use the hyperspeed effect */}
          {/* <Hyperspeed /> */}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-left z-10 flex flex-col justify-center min-h-[70vh]">
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
                <button className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Get Started →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Sections - removed the standalone RotatingText component */}
      <SkillsSection />
      <FocusOnCode />
      
      {/* Use the Footer component */}
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
            transform: translateX(calc(100vw - 100%))
              translateY(calc(100vh - 100%)) scale(0.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
