"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { useRouter } from 'next/navigation';

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

export default function BusinessMap({ businesses, height = '500px' }: BusinessMapProps) {
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
    if (!businesses || businesses.length === 0) {
      return [40.7128, -74.0060]; // Default: New York City
    }
    
    // Calculate the average of all coordinates
    const totalLat = businesses.reduce((sum, business) => sum + business.coordinates.lat, 0);
    const totalLng = businesses.reduce((sum, business) => sum + business.coordinates.lng, 0);
    
    return [
      totalLat / businesses.length,
      totalLng / businesses.length
    ] as [number, number]; // Type assertion to tuple
  };
  
  const viewBusinessDetails = (id: number) => {
    router.push(`/businesses/${id}`);
  };
  
  // Always render a placeholder first to avoid hydration issues
  if (!isMounted || !mapComponents) {
    return (
      <div 
        style={{ 
          height, 
          width: '100%', 
          backgroundColor: 'hsl(var(--muted))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.5rem'
        }}
      >
        <p>Loading map...</p>
      </div>
    );
  }
  
  const center = calculateCenter();
  const { MapContainer, TileLayer, Marker, Popup } = mapComponents;
  
  // Only create the actual map after the component is mounted
  return (
    <div style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <MapContainer 
        center={center}
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {businesses.map(business => (
          <Marker 
            key={business.id}
            position={[business.coordinates.lat, business.coordinates.lng] as [number, number]}
            icon={priceGougingIcon}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  {business.businessName}
                </h3>
                {business.title && (
                  <p style={{ 
                    fontSize: '0.875rem', 
                    marginBottom: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {business.title}
                  </p>
                )}
                <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  📍 {business.location}
                </p>
                {business.category && (
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    Category: {business.category}
                  </p>
                )}
                {business.price && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderRadius: '0.25rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'gray' }}>Before</div>
                      <div style={{ fontWeight: 'bold' }}>{business.price.before}</div>
                    </div>
                    <div style={{ fontSize: '1.25rem' }}>→</div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'gray' }}>After</div>
                      <div style={{ fontWeight: 'bold', color: 'red' }}>{business.price.after}</div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => viewBusinessDetails(business.id)}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    width: '100%'
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
