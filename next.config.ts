import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      // Keep any other domains you already have listed here
    ],
  },
  // Any other existing configuration...
};

export default nextConfig;
