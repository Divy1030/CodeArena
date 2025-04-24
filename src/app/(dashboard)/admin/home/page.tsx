import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/dashboard/button";
import { Card, CardContent } from "@/components/ui/dashboard/Card";
import { User, Plus } from "lucide-react";

// TypeScript interface for contest card data (if needed)
interface ContestCardData {
  id: number;
  title: string;
  difficulty: string;
  participants: number;
  languages: string[];
}

const AdminHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Hero */}
      <div className="flex flex-col md:flex-row justify-between items-center px-24 py-12">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold leading-snug mb-4">
            Enter the Arena, Unleash Your Coding Skills, and Conquer the Challenge.
          </h2>
          <p className="text-gray-300 text-lg">
            Join competitive coding contests and improve your programming skills through real-world challenges
          </p>
        </div>
        <div className="relative w-[427px] h-[427px] mt-10 md:mt-0">
          <Image
            src="/images/dashboard/admin/AdminHome.webp"
            alt="Coding Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Manage Contests */}
      <div className="px-24 bg-[#121B38] py-16">
        <h3 className="text-2xl font-semibold mb-6">Manage Contests</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item: number, index: number) => (
            <Card key={index} className="bg-[#4A55A2] text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold">Weekly Challenge #45</h4>
                  <span className="text-xs bg-yellow-500 text-black rounded-full px-2 py-0.5">Medium</span>
                </div>
                <p className="text-sm text-gray-200 mb-4">
                  <User className="inline-block w-4 h-4 mr-1" />234 participants
                </p>
                <div className="flex space-x-2 mb-4">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/images/dashboard/logo/js.webp"
                      alt="JavaScript"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="relative w-5 h-5">
                    <Image
                      src="/images/dashboard/logo/python.webp"
                      alt="Python"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="relative w-5 h-5">
                    <Image
                      src="/images/dashboard/logo/c.webp"
                      alt="C++"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <Button className="bg-orange-400 text-black hover:bg-orange-500 w-full">
                  Edit Contest
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;