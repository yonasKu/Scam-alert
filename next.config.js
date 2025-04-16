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
  // Configure i18n for the multi-language support
  i18n: {
    locales: ['en', 'am'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
