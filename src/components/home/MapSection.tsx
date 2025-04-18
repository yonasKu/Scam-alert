"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

// Dynamically import the map component with no SSR to avoid hydration issues
const BusinessMap = dynamic(
  () => import('@/components/maps/BusinessMap'),
  { ssr: false }
);

type Business = {
  id: number;
  businessName: string;
  title?: string;
  description?: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category?: string;
  price?: {
    before: string;
    after: string;
  };
  item?: string;
};

type MapSectionProps = {
  businesses: Business[];
};

import { useTranslations } from 'next-intl';

import { usePathname } from 'next/navigation';

export default function MapSection({ businesses }: MapSectionProps) {
  const t = useTranslations('MapSection');
  const pathname = usePathname();
  
  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';
  return (
    <div>
      {/* Section Title */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <h2 style={{
          fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
          fontWeight: "bold",
          marginBottom: "0.75rem",
          fontFamily: "var(--font-heading)",
          textAlign: "center"
        }}>
          {t('sectionTitle')}
        </h2>
        <div style={{
          maxWidth: "700px",
          color: "hsl(var(--muted-foreground))",
          fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
          textAlign: "center",
          marginBottom: "1rem"
        }}>
          {t('sectionDescription')}
        </div>
      </div>

      {/* Interactive Map with Real Leaflet Map */}
      <div style={{
        width: "100%",
        height: "300px",
        borderRadius: "0.75rem",
        overflow: "hidden",
        position: "relative",
        marginBottom: "3rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <BusinessMap businesses={businesses} height="300px" />
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem"
      }}>
        <Button asChild>
          <Link href={`/${locale}/reports`}>{t('viewMap')}</Link>
        </Button>
      </div>
    </div>
  );
}
