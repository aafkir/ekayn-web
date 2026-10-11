import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
