import React from 'react';
import ContestCard from '@/components/dashboards/user/ContestCard';
import Image from 'next/image';

// No need for importing HomeAnimation since it's in the public folder

interface HomePageProps {
  // Add any props if the component would receive any
}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className="min-h-screen bg-[#0F1A2A] p-8">
      {/* First Section: Text and Image Animation */}
      <div className="w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#0d1538] p-8 rounded-lg">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Enter the Arena, Unleash Your Coding Skills, and Conquer the Challenge.
            </h1>
            <p className="text-gray-300 mb-6">
              Join competitive coding contests and improve your programming skills through real-world challenges
            </p>
            <button className="bg-[#0169FF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors h-12 w-32">
              Register
            </button>
          </div>
          {/* Image section from public folder */}
          <div className="rounded-lg h-80 flex items-center justify-center">
            <Image 
              src="/images/dashboard/user/HomeAnimation.svg" 
              alt="Home Animation" 
              className="h-full w-auto object-contain" 
              width={500}
              height={400}
              priority
            />
          </div>
        </div>
      </div>

      {/* Second Section: Contest Cards and Other Elements */}
      <div className="w-full p-8">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Active Contests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContestCard />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Previous Contests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContestCard isPrevious={true} difficulty="Hard" />
            <ContestCard isPrevious={true} difficulty="Medium" />
            <ContestCard isPrevious={true} difficulty="Hard" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;