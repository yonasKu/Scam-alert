/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // App Router handles i18n through the [locale] folder structure
  // Do not use the legacy i18n config with App Router
};

module.exports = nextConfig;
