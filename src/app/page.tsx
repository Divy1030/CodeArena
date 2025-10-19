"use client";

import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FlowingMenuSection from "@/components/sections/FlowingMenuSection";
import CardSection from "@/components/sections/CardSection";

export default function Home() {
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
      <CardSection />
      {/* Footer */}
      <Footer />
    </div>
  );
}
