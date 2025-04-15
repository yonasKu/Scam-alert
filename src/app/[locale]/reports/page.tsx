"use client";

import { useTranslations } from 'next-intl';

export default function ReportsPage() {
  const t = useTranslations('reports');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="mb-4">{t('noReports')}</p>
    </div>
  );
}
