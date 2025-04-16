import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // Other Next.js config options
  reactStrictMode: true,
  // Suppress hydration warnings for attributes added by browser extensions
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Configure React to suppress specific hydration warnings
  // This is important for attributes added by browser extensions like ColorZilla
  experimental: {
    strictNextHead: true
  }
};

export default withNextIntl(nextConfig);
