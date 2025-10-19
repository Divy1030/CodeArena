"use client";

import React from "react";
import Link from "next/link";
import DarkVeil from "@/components/bits/DarkVeil";

export default function HeroSection() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* DarkVeil effect container - absolute positioning within the section */}
      <div className="absolute bg-red-100  w-full h-full">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0.05}
          scanlineIntensity={0.1}
          speed={0.8}
          scanlineFrequency={0.02}
          warpAmount={0.1}
          resolutionScale={1.2}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full w-full flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-normal mb-8 text-white">
            Master Coding Through Competitive Challenges
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-white">
            Join contests, solve problems, and elevate your programming skills
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="group relative px-8 py-4 bg-white/5 backdrop-blur-lg text-white font-semibold rounded-2xl border border-white/30 shadow-2xl hover:shadow-3xl hover:bg-white/10 hover:border-white/50 transform transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100">
                <span className="relative z-10 tracking-wide">
                  Get Started
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-50 transition-all duration-500 blur-md"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}