import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'japan-pop-now.com',
      'images.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'japan-pop-now.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
