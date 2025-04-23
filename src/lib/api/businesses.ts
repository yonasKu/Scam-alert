import { supabase } from '../supabase';
import { Report, ReportType, fetchReportsByBusiness } from './reports';

// Re-export the fetchReportsByBusiness function from reports.ts
export { fetchReportsByBusiness };

// Type definitions
export interface Business {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  report_count?: number;
  created_at?: string;
  scam_score?: number;
  isHighRisk?: boolean;
  isRecent?: boolean;
  isTrending?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CommonScam {
  scam_description: string;
  occurrence_count: number;
}

export interface ReportTypeCount {
  report_type: string;
  count: number;
}

// Fetch all businesses
export async function fetchBusinesses() {
  console.log('Fetching businesses from Supabase...');
  
  // First check if the table exists and is accessible
  const { error: tableError } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true });
  
  if (tableError) {
    console.error('Error checking businesses table:', tableError.message);
    throw tableError;
  }
  
  // Now fetch the actual data
  const { data, error, count } = await supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .order('name');
  
  if (error) {
    console.error('Error fetching businesses:', error.message);
    throw error;
  }
  
  console.log(`Successfully fetched ${count || 0} businesses:`, data);
  return data || [];
}

// Fetch a single business by ID
export async function fetchBusinessById(id: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Search businesses by name
export async function searchBusinessesByName(name: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .ilike('name', `%${name}%`)
    .order('name');
  
  if (error) throw error;
  return data;
}

// Fetch businesses with highest report counts
export async function fetchMostReportedBusinesses(limit: number = 10) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('report_count', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

// Update business report count
export async function incrementBusinessReportCount(id: string) {
  // First get the current report count
  const { data: business, error: fetchError } = await supabase
    .from('businesses')
    .select('report_count')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Then increment it
  const newCount = (business.report_count || 0) + 1;
  
  const { data, error } = await supabase
    .from('businesses')
    .update({ report_count: newCount })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Calculate scam score for a business
export async function calculateScamScore(businessId: string): Promise<number> {
  // Fetch all reports for this business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();
  
  if (businessError) throw businessError;
  
  // Fetch all reports for this business
  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  
  if (reportsError) throw reportsError;
  
  if (!reports || reports.length === 0) {
    return 0; // No reports, no scam score
  }
  
  // 1. Report Count Factor (0-10)
  const reportCount = reports.length;
  const reportCountFactor = Math.min(reportCount / 2, 10); // Max out at 20 reports
  
  // 2. Recency Factor (0-10)
  // Calculate how recent the reports are (weighted more for recent reports)
  const now = new Date();
  const recencyScores = reports.map(report => {
    const reportDate = new Date(report.created_at || '');
    const daysSinceReport = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24));
    // Reports in the last 30 days get higher scores
    return Math.max(0, 10 - (daysSinceReport / 30) * 10);
  });
  const recencyFactor = recencyScores.reduce((sum, score) => sum + score, 0) / reports.length;
  
  // 3. Severity Factor (0-10)
  // Different report types have different severity weights
  const severityWeights: Record<ReportType, number> = {
    'price_gouging': 7,
    'no_receipt': 5,
    'suspicious_activity': 8,
    'unauthorized_charges': 9
  };
  
  const severityScores = reports.map(report => 
    severityWeights[report.report_type as ReportType] || 5 // Default to 5 if type not found
  );
  const severityFactor = severityScores.reduce((sum, score) => sum + score, 0) / reports.length;
  
  // Calculate final score (0-10 scale)
  const scamScore = (reportCountFactor * 0.5) + (recencyFactor * 0.3) + (severityFactor * 0.2);
  
  // Round to one decimal place
  return Math.round(scamScore * 10) / 10;
}

// Update scam score in the database
export async function updateScamScore(businessId: string): Promise<Business> {
  // Calculate the score
  const scamScore = await calculateScamScore(businessId);
  
  // Update the business record
  const { data, error } = await supabase
    .from('businesses')
    .update({ scam_score: scamScore })
    .eq('id', businessId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Update scam scores for all businesses
export async function updateAllScamScores(): Promise<void> {
  // Get all businesses
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id');
  
  if (error) throw error;
  
  // Update each business score
  for (const business of businesses) {
    await updateScamScore(business.id);
  }
}

// Fetch businesses with scam scores
export async function fetchBusinessesWithScores() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('scam_score', { ascending: false });
  
  if (error) throw error;
  return data;
}

/**
 * Fetches all businesses with their scam scores
 * @param limit Maximum number of businesses to return
 * @returns Array of businesses with scam scores
 */
export async function getAllBusinessesWithScores(limit = 20): Promise<Business[]> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('scam_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching businesses with scores:', error.message);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getAllBusinessesWithScores:', err);
    return [];
  }
}

/**
 * Fetches businesses with scam scores in a specific range
 * @param minScore Minimum scam score (inclusive)
 * @param maxScore Maximum scam score (inclusive)
 * @param limit Maximum number of businesses to return
 * @returns Array of businesses with scam scores in the specified range
 */
export async function getBusinessesByScamScoreRange(
  minScore: number, 
  maxScore: number, 
  limit = 20
): Promise<Business[]> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .gte('scam_score', minScore)
      .lte('scam_score', maxScore)
      .order('scam_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching businesses by score range:', error.message);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getBusinessesByScamScoreRange:', err);
    return [];
  }
}

// Fetch most common scams for a specific business
export async function fetchMostCommonScams(businessName: string, limit: number = 3): Promise<CommonScam[]> {
  const { data, error } = await supabase
    .rpc('get_most_common_scams', { 
      business_name_param: businessName,
      limit_count: limit 
    });
  
  if (error) {
    console.error('Error fetching common scams:', error.message);
    throw error;
  }
  
  return data || [];
}

// Fetch report types with counts for a specific business
export async function fetchReportTypesByBusiness(businessName: string): Promise<ReportTypeCount[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('report_type')
    .ilike('business_name', businessName);
  
  if (error) {
    console.error('Error fetching report types:', error.message);
    throw error;
  }
  
  // Count occurrences of each report type
  const typeCounts: Record<string, number> = {};
  data.forEach(report => {
    const type = report.report_type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  // Convert to array format
  const result: ReportTypeCount[] = Object.entries(typeCounts).map(([type, count]) => ({
    report_type: type,
    count
  }));
  
  // Sort by count (descending)
  return result.sort((a, b) => b.count - a.count);
}

// Get businesses with highest scam scores
export async function getHighRiskBusinesses(limit = 10) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('scam_score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching high risk businesses:', error.message);
    throw error;
  }
  
  return data || [];
}

// Get recently reported businesses
export async function getRecentlyReportedBusinesses(limit = 10) {
  // First get recent reports
  const { data: recentReports, error: reportsError } = await supabase
    .from('reports')
    .select('business_name, created_at')
    .order('created_at', { ascending: false })
    .limit(50); // Get more than we need to account for duplicates
  
  if (reportsError) {
    console.error('Error fetching recent reports:', reportsError.message);
    throw reportsError;
  }
  
  if (!recentReports || recentReports.length === 0) {
    return [];
  }
  
  // Get unique business names from recent reports
  const uniqueBusinessNames = Array.from(new Set(
    recentReports.map(report => report.business_name)
  )).slice(0, limit);
  
  if (uniqueBusinessNames.length === 0) {
    return [];
  }
  
  // Fetch business details for these names
  const { data: businesses, error: businessesError } = await supabase
    .from('businesses')
    .select('*')
    .in('name', uniqueBusinessNames);
  
  if (businessesError) {
    console.error('Error fetching businesses by names:', businessesError.message);
    throw businessesError;
  }
  
  // Sort businesses by the order of uniqueBusinessNames
  return (businesses || []).sort((a, b) => {
    const indexA = uniqueBusinessNames.findIndex(name => 
      name.toLowerCase() === a.name.toLowerCase()
    );
    const indexB = uniqueBusinessNames.findIndex(name => 
      name.toLowerCase() === b.name.toLowerCase()
    );
    return indexA - indexB;
  });
}

// Get businesses with rapidly increasing report counts
export async function getTrendingBusinesses(limit = 10, timeframeDays = 7) {
  try {
    // First try to use the SQL function
    const { data, error } = await supabase.rpc('get_trending_businesses', { 
      limit_count: limit,
      days_back: timeframeDays
    });
    
    if (error) {
      console.error('Error fetching trending businesses:', error.message);
      // Return high risk businesses as fallback
      return getHighRiskBusinesses(limit);
    }
    
    // Map the returned data to match the Business interface
    // The SQL function returns business_id, but we need id
    return (data || []).map((item: any) => ({
      id: item.business_id,
      name: item.name,
      address: item.address,
      city: item.city,
      state: item.state,
      zip: item.zip,
      report_count: item.report_count,
      scam_score: item.scam_score,
      created_at: item.created_at,
      // Store the recent_reports count in a property we can use later
      recent_report_count: item.recent_reports
    }));
  } catch (err) {
    console.error('Error in getTrendingBusinesses:', err);
    // Fallback to high risk businesses
    return getHighRiskBusinesses(limit);
  }
}

// Get businesses to watch (combines high risk, recent, and trending)
export async function getBusinessesToWatch(limit = 10): Promise<Business[]> {
  try {
    // Get businesses from all three categories
    const [highRisk, recent, trending] = await Promise.all([
      getHighRiskBusinesses(limit),
      getRecentlyReportedBusinesses(limit),
      getTrendingBusinesses(limit)
    ]);
    
    // Combine and deduplicate
    const businessMap = new Map<string, Business>();
    
    // Add businesses with priority flags
    [...highRisk, ...recent, ...trending].forEach(business => {
      if (!businessMap.has(business.id)) {
        business.isHighRisk = highRisk.some((b: Business) => b.id === business.id);
        business.isRecent = recent.some((b: Business) => b.id === business.id);
        business.isTrending = trending.some((b: Business) => b.id === business.id);
        businessMap.set(business.id || '', business);
      }
    });
    
    // Convert to array and sort by priority
    const combined = Array.from(businessMap.values());
    
    // Sort by priority: first trending, then high risk, then recent
    combined.sort((a: Business, b: Business) => {
      // First by trending
      if (a.isTrending && !b.isTrending) return -1;
      if (!a.isTrending && b.isTrending) return 1;
      
      // Then by high risk (scam score)
      if (a.isHighRisk && !b.isHighRisk) return -1;
      if (!a.isHighRisk && b.isHighRisk) return 1;
      if (a.isHighRisk && b.isHighRisk) {
        return (b.scam_score || 0) - (a.scam_score || 0);
      }
      
      // Then by recency
      if (a.isRecent && !b.isRecent) return -1;
      if (!a.isRecent && b.isRecent) return 1;
      
      return 0;
    });
    
    // Return limited number
    return combined.slice(0, limit);
  } catch (error) {
    console.error('Error getting businesses to watch:', error);
    return [];
  }
}

// Ethiopian cities with coordinates - used for geocoding and fallbacks
const ethiopianCities = [
  { name: 'Addis Ababa', lat: 9.0222, lng: 38.7468 },
  { name: 'Dire Dawa', lat: 9.5931, lng: 41.8661 },
  { name: 'Mekelle', lat: 13.4967, lng: 39.4697 },
  { name: 'Gondar', lat: 12.6030, lng: 37.4521 },
  { name: 'Bahir Dar', lat: 11.5742, lng: 37.3614 },
  { name: 'Hawassa', lat: 7.0504, lng: 38.4955 },
  { name: 'Jimma', lat: 7.6780, lng: 36.8344 },
  { name: 'Dessie', lat: 11.1333, lng: 39.6333 },
  { name: 'Jijiga', lat: 9.3500, lng: 42.8000 },
  { name: 'Shashamane', lat: 7.2000, lng: 38.6000 },
  { name: 'Adama', lat: 8.5400, lng: 39.2700 },
  { name: 'Bishoftu', lat: 8.7500, lng: 38.9800 },
  { name: 'Debre Birhan', lat: 9.6800, lng: 39.5300 },
  { name: 'Debre Markos', lat: 10.3500, lng: 37.7300 },
  { name: 'Debre Tabor', lat: 11.8500, lng: 38.0200 },
  { name: 'Harar', lat: 9.3100, lng: 42.1200 },
  { name: 'Nekemte', lat: 9.0900, lng: 36.5500 },
  { name: 'Asosa', lat: 10.0700, lng: 34.5300 },
  { name: 'Gambela', lat: 8.2500, lng: 34.5900 },
  { name: 'Asella', lat: 7.9500, lng: 39.1400 }
];

// Simple geocoding function that matches location text to known Ethiopian cities
function geocodeLocationText(locationText: string): { lat: number, lng: number } | null {
  if (!locationText) return null;
  
  // Normalize location text for comparison
  const normalizedLocation = locationText.toLowerCase().trim();
  
  // Check for exact matches or partial matches in city names
  for (const city of ethiopianCities) {
    if (
      normalizedLocation.includes(city.name.toLowerCase()) ||
      city.name.toLowerCase().includes(normalizedLocation)
    ) {
      // Add a small random offset to prevent markers from stacking exactly
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      
      return {
        lat: city.lat + latOffset,
        lng: city.lng + lngOffset
      };
    }
  }
  
  // Default to Addis Ababa with a random offset if no match is found
  const latOffset = (Math.random() - 0.5) * 0.05;
  const lngOffset = (Math.random() - 0.5) * 0.05;
  
  return {
    lat: 9.0222 + latOffset,
    lng: 38.7468 + lngOffset
  };
}

// Get businesses with location data for map display
export async function getBusinessesWithLocationData(limit = 20): Promise<Business[]> {
  try {
    // Get businesses with the highest report counts
    const { data: businessesFromDb, error } = await supabase
      .from('businesses')
      .select('*')
      .order('report_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching businesses with location data:', error.message);
      return [];
    }
    
    // Get reports to extract location data
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // Get more reports to increase chance of finding location data
    
    if (reportsError) {
      console.error('Error fetching reports for location data:', reportsError.message);
      return [];
    }
    
    // Create a map to store unique businesses with location data
    const businessMap = new Map<string, Business>();
    
    // Process businesses from database and add geocoded coordinates
    businessesFromDb?.forEach(business => {
      // Try to geocode the business location from city or address
      const locationText = business.city || business.address || business.state || '';
      const coordinates = geocodeLocationText(locationText);
      
      if (coordinates) {
        if (coordinates) {
          businessMap.set(business.id, {
            ...business,
            latitude: coordinates.lat,
            longitude: coordinates.lng
          });
        }
      }
    });
    
    // Process reports to extract location data for businesses not already in the map
    reports?.forEach(report => {
      // Skip if we already have this business
      if (!report.business_name || businessMap.has(report.business_id || '')) return;
      
      // Try to geocode the report location
      const locationText = report.location || report.city || '';
      const coordinates = geocodeLocationText(locationText);
      
      if (coordinates) {
        // Create a business object from report data
        const business: Business = {
          id: report.business_id || report.id,
          name: report.business_name,
          address: report.location || '',
          city: report.city || 'Addis Ababa',
          state: 'Ethiopia',
          zip: '',
          report_count: 1,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          scam_score: 5 // Default medium score
        };
        
        businessMap.set(business.id || '', business);
      }
    });
    
    // If we don't have enough businesses, get high risk businesses
    if (businessMap.size < limit) {
      // Get high risk businesses to supplement
      const highRiskBusinesses = await getHighRiskBusinesses(limit);
      
      // Add location data to high risk businesses
      highRiskBusinesses.forEach((business, index) => {
        if (businessMap.has(business.id)) return;
        
        // Try to geocode the business location
        const locationText = business.city || business.address || business.state || '';
        let coordinates;
        
        if (locationText) {
          coordinates = geocodeLocationText(locationText);
        } else {
          // If no location text, assign a city from the list, cycling through them
          const cityData = ethiopianCities[index % ethiopianCities.length];
          coordinates = {
            lat: cityData.lat + (Math.random() - 0.5) * 0.02,
            lng: cityData.lng + (Math.random() - 0.5) * 0.02
          };
        }
        
        if (coordinates) {
          businessMap.set(business.id, {
            ...business,
            latitude: coordinates.lat,
            longitude: coordinates.lng
          });
        }
      });
    }
    
    // Convert map to array and sort by report count
    const businessesWithLocation = Array.from(businessMap.values())
      .sort((a, b) => (b.report_count || 0) - (a.report_count || 0))
      .slice(0, limit);
    
    return businessesWithLocation;
  } catch (error) {
    console.error('Error in getBusinessesWithLocationData:', error);
    return [];
  }
}
