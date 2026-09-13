import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: '/student/explore/:path*',
        destination: '/student/dashboard',
        permanent: false,
      },
      {
        source: '/student/explore',
        destination: '/student/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
