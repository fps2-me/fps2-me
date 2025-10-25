import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  // async redirects() {
  //   return [
  //     // Basic redirect
  //     // {
  //     //   source: '/qr-generator',
  //     //   destination: '/qr',
  //     //   permanent: true,
  //     // },
  //     // // Wildcard path matching
  //     // {
  //     //   source: '/blog/:slug',
  //     //   destination: '/news/:slug',
  //     //   permanent: true,
  //     // },
  //   ]
  // },
};

export default nextConfig;
