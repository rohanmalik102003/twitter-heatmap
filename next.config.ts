import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
