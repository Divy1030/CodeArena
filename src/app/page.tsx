"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FlowingMenuSection from "@/components/sections/FlowingMenuSection";
import { WobbleCardDemo } from "@/components/bits/Bento";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar - positioned above hero section */}
      <div className="relative z-50">
        <Navbar isAuthenticated={false} isAdmin={false} />
      </div>
      {/* Hero Section with DarkVeil Background - full viewport height */}
      <HeroSection />
      {/* FlowingMenu Section - Black background */}
      <FlowingMenuSection />
      {/* Card Swap Section */}
      {/* <CardSection /> */}
      {/* Bento Section */}
      <section className="py-16 px-4 bg-black">
        <WobbleCardDemo />
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
