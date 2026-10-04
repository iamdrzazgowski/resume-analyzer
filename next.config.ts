import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  // bundle-barrel-imports: transform lucide-react barrel imports to direct imports
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
