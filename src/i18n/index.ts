// Supported locales
export const locales = ['en', 'am'] as const;

// For TypeScript - locale type
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale = 'en';

// Get internationalized paths
export function getI18nPath(path: string, locale: Locale) {
  return `/${locale}${path}`;
}
