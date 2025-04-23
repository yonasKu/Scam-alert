// Business type with required props for map and business components
export type Business = {
  id: string | number;
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
  scam_score?: number;
};
