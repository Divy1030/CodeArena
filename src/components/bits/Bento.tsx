"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-[#144272] min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Code Arena powers competitive programming excellence
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            With over 10,000+ problems solved daily, Code Arena is the premier
            platform for competitive programmers and coding enthusiasts.
          </p>
        </div>
        {/* Responsive code editor - hidden on mobile, shown on larger screens */}
        <div className="hidden md:block absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-gray-900/80 backdrop-blur rounded-lg p-7 border border-gray-700 w-96">
          <div className="text-green-400 text-base font-mono">
            <div className="flex items-center gap-1 mb-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 ml-1 text-sm">solution.cpp</span>
            </div>
            <div className="text-sm">
              <span className="text-purple-400">#include</span>{" "}
              <span className="text-green-400">&lt;iostream&gt;</span>
              <br />
              <span className="text-blue-400">int</span>{" "}
              <span className="text-yellow-400">main</span>(){"{"}
              <br />
              &nbsp;&nbsp;
              <span className="text-gray-400">// Your solution here</span>
              <br />
              &nbsp;&nbsp;
              <span className="text-blue-400">return</span>{" "}
              <span className="text-orange-400">0</span>;
              <br />
              {"}"}
            </div>
          </div>
        </div>
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-[#205295]">
        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Real-time contests, live leaderboards
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          Compete with thousands of programmers worldwide in timed contests with
          instant feedback and rankings.
        </p>
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-[#0A2647] min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Join Code Arena today and master algorithmic thinking!
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Practice with curated problem sets, participate in weekly contests,
            and climb the global leaderboard. From beginner to expert level.
          </p>
        </div>
        {/* Compiler card - hidden on mobile */}
        <div className="hidden md:block absolute right-4 sm:right-8 md:right-16 lg:right-36 xl:right-42 bottom-6 sm:bottom-8 md:bottom-12 lg:bottom-16 bg-gray-900/90 backdrop-blur rounded-xl p-4 sm:p-5 md:p-7 border border-gray-700 shadow-2xl max-w-[320px] sm:max-w-[360px] md:max-w-none">
          <div className="text-sm">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 ml-1 md:ml-2 text-xs md:text-sm">Code Arena IDE</span>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-2 md:mb-3">
              <div className="text-green-400 font-mono text-xs sm:text-sm">
            <span className="text-gray-500">1</span>{" "}
            <span className="text-purple-400">def</span>{" "}
            <span className="text-yellow-400">solve</span>(
            <span className="text-blue-400">arr</span>):<br />
            <span className="text-gray-500">2</span>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-blue-400">return</span>{" "}
            <span className="text-yellow-400">max</span>(
            <span className="text-blue-400">arr</span>)<br />
            <span className="text-gray-500">3</span> <br />
            <span className="text-gray-500">4</span>{" "}
            <span className="text-yellow-400">print</span>(
            <span className="text-yellow-400">solve</span>([
            <span className="text-orange-400">1,2,3,4,5</span>]))
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400">Accepted</span>
              </div>
              <div className="text-gray-400">Runtime: 42ms</div>
              <div className="text-gray-400 hidden sm:block">Memory: 14.2MB</div>
            </div>
          </div>
        </div>
      </WobbleCard>
    </div>
  );
}
