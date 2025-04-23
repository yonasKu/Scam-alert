"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { getBusinessesWithLocationData } from '@/lib/api/businesses';
import { Business } from '@/types/business';

// Dynamically import the map component with no SSR to avoid hydration issues
const BusinessMap = dynamic(
  () => import('@/components/maps/BusinessMap'),
  { ssr: false }
);

// Sample Ethiopian businesses
const ethiopianBusinesses = [
  {
    id: "999001",
    businessName: "Merkato Market",
    title: "Sample Location",
    description: "Largest open market in Africa",
    location: "Addis Ababa, Ethiopia",
    coordinates: {
      lat: 9.0107,
      lng: 38.7612
    },
    category: "Market",
    price: {
      before: "50 ETB",
      after: "75 ETB"
    },
    item: "Basic groceries",
    scam_score: 5
  },
  {
    id: "999002",
    businessName: "Bole Road Shop",
    title: "Sample Location",
    description: "Shopping area in Bole district",
    location: "Bole, Addis Ababa",
    coordinates: {
      lat: 8.9806,
      lng: 38.7578
    },
    category: "Retail",
    price: {
      before: "200 ETB",
      after: "350 ETB"
    },
    item: "Electronics",
    scam_score: 5
  },
  {
    id: "999003",
    businessName: "Piazza Store",
    title: "Sample Location",
    description: "Historic shopping district",
    location: "Piazza, Addis Ababa",
    coordinates: {
      lat: 9.0340,
      lng: 38.7502
    },
    category: "Clothing",
    price: {
      before: "300 ETB",
      after: "450 ETB"
    },
    item: "Imported goods",
    scam_score: 5
  }
];

// Using the shared Business type from @/types/business

type MapSectionProps = {
  businesses: Business[];
};

import { useTranslations } from 'next-intl';

import { usePathname } from 'next/navigation';

export default function MapSection({ businesses: initialBusinesses }: MapSectionProps) {
  const t = useTranslations('MapSection');
  const pathname = usePathname();
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses || []);
  const [loading, setLoading] = useState(true);
  
  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';
  
  // Fetch businesses with location data
  useEffect(() => {
    async function fetchBusinessesWithLocation() {
      try {
        setLoading(true);
        const businessesData = await getBusinessesWithLocationData(15);
        
        // Transform the business data to match the expected format for the map
        const formattedBusinesses = businessesData.map(business => {
          // Generate a price increase for display purposes (for demonstration)
          const basePrice = Math.floor(Math.random() * 500) + 50; // Random price between 50 and 550 ETB
          const priceIncrease = Math.floor(basePrice * (Math.random() * 0.5 + 0.2)); // 20-70% increase
          
          return {
            id: business.id || Math.random().toString(36).substring(2, 9),
            businessName: business.name,
            title: business.name,
            description: `${business.report_count || 0} ${business.report_count === 1 ? 'report' : 'reports'} filed`,
            location: business.city || business.address || 'Addis Ababa, Ethiopia',
            coordinates: {
              lat: business.latitude || 9.0222, // Default to Addis Ababa if no coordinates
              lng: business.longitude || 38.7468
            },
            // Make sure these optional properties match the Business type
            category: 'Reported Business',
            price: {
              before: `${basePrice} ETB`,
              after: `${basePrice + priceIncrease} ETB`
            },
            item: 'Various items',
            scam_score: business.scam_score || Math.floor(Math.random() * 10) + 1 // Random score if none provided
          };
        });
        
        // If we don't have enough businesses, add some sample ones
        const combinedBusinesses = [...formattedBusinesses];
        if (combinedBusinesses.length < 5) {
          // Only add sample businesses if we need more
          const samplesToAdd = 5 - combinedBusinesses.length;
          combinedBusinesses.push(...ethiopianBusinesses.slice(0, samplesToAdd));
        }
        
        setBusinesses(combinedBusinesses);
      } catch (error) {
        console.error('Error fetching businesses with location data:', error);
        // Fallback to sample businesses if there's an error
        setBusinesses(ethiopianBusinesses);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBusinessesWithLocation();
  }, []);
  
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
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: 'hsla(var(--muted) / 0.1)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ 
                  margin: '0 auto 0.5rem',
                  animation: 'spin 1s linear infinite'
                }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <p>Loading map data...</p>
            </div>
          </div>
        ) : (
          <BusinessMap 
            businesses={businesses} 
            height="300px"
            forceEthiopianCenter={true}
          />
        )}
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
