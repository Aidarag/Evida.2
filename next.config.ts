import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: '/explore',
        destination: '/student/explore',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
