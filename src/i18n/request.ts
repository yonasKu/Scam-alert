import { getRequestConfig } from 'next-intl/server';
import { locales } from '@/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Make sure locale is a string (not undefined)
  const resolvedLocale = locale || 'en';
  
  try {
    // Load messages for the requested locale
    const messages = (await import(`../../messages/${resolvedLocale}.json`)).default;
    
    return {
      locale: resolvedLocale,
      messages,
    };
  } catch (error) {
    // Fallback to basic configuration if messages can't be loaded
    console.error(`Failed to load messages for locale ${resolvedLocale}:`, error);
    return {
      locale: resolvedLocale,
      messages: {},
    };
  }
});
