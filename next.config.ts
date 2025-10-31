import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

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

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
