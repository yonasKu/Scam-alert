import { getRequestConfig } from 'next-intl/server';
 
export const locales = ['en', 'am'] as const;
export type Locale = (typeof locales)[number];

// We're using a simpler approach with the messages defined directly in the layout.tsx file
// This avoids dynamic import issues with the file paths
export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale || 'en',
    // The messages will be provided in the layout component
    messages: {}
  };
});
