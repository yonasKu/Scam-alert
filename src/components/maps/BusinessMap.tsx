"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

// Fix Leaflet marker icon issue in Next.js
const fixLeafletIcon = () => {
  // Leaflet's default icon assets are not compatible with Next.js by default
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Custom icon for price gouging reports
const priceGougingIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Sample Ethiopian icon to distinguish sample locations
const ethiopianIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
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
    item: "Basic groceries"
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
    item: "Electronics"
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
    item: "Imported goods"
  }
];

// Business type with required props
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

// BusinessMap component props
type BusinessMapProps = {
  businesses: Business[];
  height?: string;
  showSampleLocations?: boolean;
  forceEthiopianCenter?: boolean;
  center?: [number, number];
};

// Dynamic imports for Map components to ensure they only load in the browser
const MapComponents = () => {
  // We need to return the components so they're only imported in the client
  return {
    MapContainer,
    TileLayer,
    Marker,
    Popup
  };
};

export default function BusinessMap({ 
  businesses, 
  height = '500px', 
  showSampleLocations = true,
  forceEthiopianCenter = false,
  center
}: BusinessMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mapComponents, setMapComponents] = useState<any>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Initialize Leaflet correctly on client side only
    fixLeafletIcon();
    setMapComponents(MapComponents());
    setIsMounted(true);
    
    // Clean up function
    return () => {
      setIsMounted(false);
    };
  }, []);
  
  // Calculate the center of the map based on all business coordinates
  const calculateCenter = () => {
    // ALWAYS center on Addis Ababa
    return ADDIS_ABABA_CENTER;
  };
  
  const viewBusinessDetails = (id: number) => {
    // Don't navigate for sample businesses
    if (id >= 999000 && id < 1000000) {
      return;
    }
    router.push(`/businesses/${id}`);
  };
  
  // Always render a placeholder first to avoid hydration issues
  if (!isMounted || !mapComponents) {
    return (
      <div className="flex items-center justify-center w-full rounded-md bg-muted" style={{ height }}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }
  
  const mapCenter = calculateCenter();
  const { MapContainer, TileLayer, Marker, Popup } = mapComponents;
  
  // Create a combined list of businesses to display
  const displayBusinesses = [...businesses];
  
  // If specified, add the sample Ethiopian businesses
  if (showSampleLocations) {
    // Only add sample businesses if they don't already exist in the list
    const existingIds = new Set(businesses.map(b => b.id));
    const filteredSamples = sampleBusinesses.filter(b => !existingIds.has(b.id));
    displayBusinesses.push(...filteredSamples);
  }
  
  // Zoom level - closer zoom for Addis Ababa
  const zoomLevel = 12;
  
  // Only create the actual map after the component is mounted
  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer 
        center={mapCenter}
        zoom={zoomLevel} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {displayBusinesses.map(business => {
          const isSampleBusiness = business.id >= 999000 && business.id < 1000000;
          return (
            <Marker 
              key={business.id}
              position={[business.coordinates.lat, business.coordinates.lng] as [number, number]}
              icon={isSampleBusiness ? ethiopianIcon : priceGougingIcon}
            >
              <Popup>
                <div className="min-w-[250px]">
                  <h3 className="text-base font-bold mb-2 flex items-center gap-2">
                    {business.businessName}
                    {isSampleBusiness && <Badge variant="outline" className="text-xs bg-muted font-normal">Sample</Badge>}
                  </h3>
                  
                  {business.title && (
                    <p className="text-sm mb-2 font-medium">
                      {business.title}
                    </p>
                  )}
                  
                  <p className="text-sm mb-1 flex items-center gap-1">
                    <span className="shrink-0">📍</span> 
                    <span>{business.location}</span>
                  </p>
                  
                  {business.category && (
                    <p className="text-sm mb-1">
                      Category: {business.category}
                    </p>
                  )}
                  
                  {business.price && (
                    <Card className="mt-2 bg-red-50 border-red-100">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Before</p>
                            <p className="font-medium">{business.price.before}</p>
                          </div>
                          <div className="text-lg">→</div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">After</p>
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
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
