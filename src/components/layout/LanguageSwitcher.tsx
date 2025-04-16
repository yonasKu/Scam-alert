"use client";

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { locales } from '@/i18n';
import { useTranslations } from 'next-intl';

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    
    startTransition(() => {
      // Simply navigate to the new locale path
      // This will use the same path structure but with the new locale
      router.push(`/${newLocale}`);
    });
  };

  return (
    <div className="flex items-center space-x-2">
      {locales.map((loc) => (
        <Button
          key={loc}
          variant={locale === loc ? "default" : "outline"}
          size="sm"
          onClick={() => handleLocaleChange(loc)}
          disabled={isPending || locale === loc}
          className="text-sm"
        >
          {loc === 'en' ? t('english') : t('amharic')}
        </Button>
      ))}
    </div>
  );
}
