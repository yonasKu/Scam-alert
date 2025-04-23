"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from 'next-intl';
import { Business } from '@/types/business';

// Fix Leaflet marker icon issue in Next.js
const fixLeafletIcon = () => {
  // Leaflet's default icon assets are not compatible with Next.js by default
  delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Custom icon for high risk businesses (red marker)
const highRiskIcon = new L.Icon({
  iconUrl: '/images/marker-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Custom icon for medium risk businesses (orange marker)
const mediumRiskIcon = new L.Icon({
  iconUrl: '/images/marker-orange.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Custom icon for low risk businesses (blue marker)
const lowRiskIcon = new L.Icon({
  iconUrl: '/images/marker-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Sample Ethiopian icon to distinguish sample locations
const ethiopianIcon = new L.Icon({
  iconUrl: '/images/marker-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Fallback to default Leaflet icon if custom icons are not available
// Create a default icon using the same pattern as the other icons
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Precise Addis Ababa coordinates for map center
const ADDIS_ABABA_CENTER: [number, number] = [9.0222, 38.7468];

// Sample businesses in Ethiopia when no businesses are provided
const sampleBusinesses = [
  {
    id: 999001,
    businessName: "Merkato Market",
    title: "Sample Business",
    description: "This is a sample business for demonstration purposes",
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
    scam_score: 8
  },
  {
    id: 999002,
    businessName: "Bole Road Shop",
    title: "Sample Business",
    description: "Another sample business location in Ethiopia",
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
    id: 999003,
    businessName: "Piazza Store",
    title: "Sample Business",
    description: "Sample business in the Piazza area",
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
    scam_score: 2
  }
];

// Using the shared Business type from @/types/business

// BusinessMap component props
type BusinessMapProps = {
  businesses: Business[];
  height?: string;
  showSampleLocations?: boolean;
  forceEthiopianCenter?: boolean;
  center?: [number, number];
  showPopup?: boolean;
};

export default function BusinessMap({ 
  businesses, 
  height = '500px', 
  showSampleLocations = true,
  forceEthiopianCenter = false,
  center,
  showPopup = true
}: BusinessMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const t = useTranslations('Map');
  
  // Initialize map on the client side only
  useEffect(() => {
    // Fix Leaflet icon issues
    fixLeafletIcon();
    setIsMounted(true);
    
    // Clean up function
    return () => {
      setIsMounted(false);
    };
  }, []);
  
  // Calculate the center of the map based on all business coordinates
  const calculateCenter = (): [number, number] => {
    // If no businesses or forced to use Ethiopian center, return Addis Ababa coordinates
    if (businesses.length === 0 || forceEthiopianCenter) return ADDIS_ABABA_CENTER;
    
    // If a specific center is provided, use it
    if (center) return center;
    
    // Otherwise calculate the center from all business coordinates
    const validBusinesses = businesses.filter(b => b.coordinates && b.coordinates.lat && b.coordinates.lng);
    
    if (validBusinesses.length === 0) return ADDIS_ABABA_CENTER;
    
    // Use the first business's coordinates as the center (usually the most important one)
    return [validBusinesses[0].coordinates.lat, validBusinesses[0].coordinates.lng];
  };
  
  // Function to determine which icon to use based on scam score
  const getMarkerIcon = (scamScore?: number, business?: Business) => {
    // Determine if this is a sample business (ID starts with 999)
    const isSampleBusiness = typeof business?.id === 'number' && business.id >= 999000 && business.id < 1000000;
    
    if (isSampleBusiness) {
      return ethiopianIcon;
    }
    
    if (!scamScore) return defaultIcon;
    
    if (scamScore >= 7) {
      return highRiskIcon;
    } else if (scamScore >= 4) {
      return mediumRiskIcon;
    } else {
      return lowRiskIcon;
    }
  };
  
  const viewBusinessDetails = (id: string | number) => {
    router.push(`/business/${id}`);
  };
  
  // Always render a placeholder first to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center w-full rounded-md bg-muted" style={{ height }}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }
  
  // Create a combined list of businesses to display
  const displayBusinesses = [...businesses];
  
  // If specified, add the sample Ethiopian businesses
  if (showSampleLocations && businesses.length < 3) {
    // Only add sample businesses if they don't already exist in the list
    const existingIds = new Set(businesses.map(b => b.id));
    const filteredSamples = sampleBusinesses.filter(b => !existingIds.has(b.id));
    displayBusinesses.push(...filteredSamples);
  }

  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer 
        center={calculateCenter()}
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {displayBusinesses.map(business => {
          // Determine if this is a sample business (ID starts with 999)
          const isSampleBusiness = typeof business.id === 'number' && business.id >= 999000 && business.id < 1000000;
          
          return (
            // @ts-expect-error: Marker children type issue in @types/react-leaflet
            <Marker 
              key={business.id.toString()}
              position={[business.coordinates.lat, business.coordinates.lng]}
              icon={getMarkerIcon(business.scam_score, business)}
            >
              {showPopup ? (
                <Popup>
                  <div className="min-w-[250px]">
                    <h3 className="text-base font-bold mb-2 flex items-center gap-2">
                      {business.businessName}
                      {isSampleBusiness && <Badge variant="outline" className="text-xs bg-muted font-normal">Sample</Badge>}
                    </h3>
                    
                    {business.description && (
                      <p className="text-sm mb-2">
                        {business.description}
                      </p>
                    )}
                    
                    {business.scam_score && (
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">{t('riskLevel')}:</p>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${business.scam_score >= 7 ? 'bg-red-500' : business.scam_score >= 4 ? 'bg-orange-400' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(business.scam_score * 10, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>{business.scam_score}/10</span>
                          <span className={`font-medium ${business.scam_score >= 7 ? 'text-red-500' : business.scam_score >= 4 ? 'text-orange-400' : 'text-green-500'}`}>
                            {business.scam_score >= 7 ? t('highRisk') : business.scam_score >= 4 ? t('mediumRisk') : t('lowRisk')}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm mb-1 flex items-center gap-1">
                      <span className="shrink-0">📍</span> 
                      <span>{business.location}</span>
                    </p>
                    
                    {business.category && (
                      <p className="text-sm mb-1">
                        {t('category')}: {business.category}
                      </p>
                    )}
                    
                    {business.price && (
                      <Card className="mt-2 bg-red-50 border-red-100">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">{t('before')}</p>
                              <p className="font-medium">{business.price.before}</p>
                            </div>
                            <div className="text-lg">→</div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">{t('after')}</p>
                              <p className="font-medium text-red-600">{business.price.after}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    <Button 
                      onClick={() => viewBusinessDetails(business.id)}
                      className="w-full mt-3"
                      variant="default"
                      size="sm"
                    >
                      {t('viewDetails')}
                    </Button>
                  </div>
                </Popup>
              ) : null}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
