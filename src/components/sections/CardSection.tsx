"use client";

import React from "react";
import Image from "next/image";
import CardSwap, { Card } from "@/components/bits/Card";

export default function CardSection() {
  return (
    <section className="relative bg-black min-h-screen py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between gap-16 h-full min-h-[60vh]">
          {/* Text Section - Left Side */}
          <div className="flex-1 max-w-lg flex flex-col justify-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Our Features
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore the powerful features that make our platform the best choice
              for competitive programming and algorithmic problem solving.
            </p>
          </div>

          {/* Card Section - Right Side */}
          <div className="flex-1 flex justify-center items-center h-full">
            <CardSwap
              width={600}
              height={500}
              cardDistance={50}
              verticalDistance={60}
              delay={4000}
              pauseOnHover={true}
              skewAmount={5}
              easing="elastic"
              onCardClick={(idx) => console.log(`Card ${idx} clicked`)}
            >
              {/* Card 1 - Real-time Contests */}
              <Card customClass="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-xl">
                <div className="p-8 h-full flex flex-col justify-center">
                  <div className="mb-4 relative h-24 w-full rounded-lg overflow-hidden bg-gray-950">
                    <Image
                      src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=200&fit=crop&crop=top"
                      alt="Coding contest"
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Real-time Contests
                  </h3>
                  <p className="text-gray-300">
                    Participate in live coding contests with developers from around
                    the world. Test your skills under pressure and climb the
                    leaderboards.
                  </p>
                </div>
              </Card>

              {/* Card 2 - Algorithm Library */}
              <Card customClass="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-xl">
                <div className="p-8 h-full flex flex-col justify-center">
                  <div className="mb-4 relative h-24 w-full rounded-lg overflow-hidden bg-slate-950">
                    <Image
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=200&fit=crop&crop=center"
                      alt="Algorithm code"
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Algorithm Library
                  </h3>
                  <p className="text-slate-300">
                    Access our comprehensive library of algorithms and data
                    structures. Learn from detailed explanations and interactive
                    examples.
                  </p>
                </div>
              </Card>

              {/* Card 3 - Progress Tracking */}
              <Card customClass="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 shadow-xl">
                <div className="p-8 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Progress Tracking
                  </h3>
                  <p className="text-zinc-300">
                    Monitor your improvement with detailed analytics and progress
                    reports. Identify strengths and areas for growth in your coding
                    journey.
                  </p>
                </div>
              </Card>

              {/* Card 4 - Expert Mentorship */}
              <Card customClass="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 shadow-xl">
                <div className="p-8 h-full flex flex-col justify-center">
                  <div className="mb-4 relative h-24 w-full rounded-lg overflow-hidden bg-neutral-950">
                    <Image
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=200&fit=crop&crop=center"
                      alt="Code mentorship"
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Expert Mentorship
                  </h3>
                  <p className="text-neutral-300">
                    Get guidance from industry experts and competitive programming
                    champions. Receive personalized feedback and improve faster.
                  </p>
                </div>
              </Card>

              {/* Card 5 - Code Reviews */}
              <Card customClass="bg-gradient-to-br from-stone-900 to-stone-800 border border-stone-700 shadow-xl">
                <div className="p-8 h-full flex flex-col justify-center">
                  <div className="mb-4 relative h-24 w-full rounded-lg overflow-hidden bg-stone-950">
                    <Image
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=200&fit=crop&crop=center"
                      alt="Code review screen"
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Code Reviews
                  </h3>
                  <p className="text-stone-300">
                    Submit your solutions for peer review and learn from others.
                    Discover multiple approaches to solve complex problems.
                  </p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
}