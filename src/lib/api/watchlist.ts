import { supabase } from '../supabase';

// Type definitions
export interface WatchlistEntry {
  id?: string;
  user_id: string;
  business_id: string;
  created_at?: string;
}

// Fetch watchlist entries for a user
export async function fetchWatchlist(userId: string) {
  console.log('Fetching watchlist entries for user:', userId);
  
  // First check if the table exists and is accessible
  const { error: tableError } = await supabase
    .from('watchlist')
    .select('*', { count: 'exact', head: true });
  
  if (tableError) {
    console.error('Error checking watchlist table:', tableError.message);
    throw tableError;
  }
  
  // Now fetch the actual data
  const { data, error, count } = await supabase
    .from('watchlist')
    .select(`
      id,
      created_at,
      business_id,
      businesses (*)
    `, { count: 'exact' })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching watchlist:', error.message);
    throw error;
  }
  
  console.log(`Successfully fetched ${count || 0} watchlist entries:`, data);
  return data || [];
}

// Add a business to watchlist
export async function addToWatchlist(userId: string, businessId: string) {
  // Check if already in watchlist
  const { data: existing, error: checkError } = await supabase
    .from('watchlist')
    .select('id')
    .eq('user_id', userId)
    .eq('business_id', businessId);
  
  if (checkError) throw checkError;
  
  // If already in watchlist, return existing entry
  if (existing && existing.length > 0) {
    return existing[0];
  }
  
  // Otherwise, add to watchlist
  const { data, error } = await supabase
    .from('watchlist')
    .insert({
      user_id: userId,
      business_id: businessId
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Remove a business from watchlist
export async function removeFromWatchlist(userId: string, businessId: string) {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('business_id', businessId);
  
  if (error) throw error;
  return true;
}

// Check if a business is in user's watchlist
export async function isInWatchlist(userId: string, businessId: string) {
  const { data, error } = await supabase
    .from('watchlist')
    .select('id')
    .eq('user_id', userId)
    .eq('business_id', businessId);
  
  if (error) throw error;
  return data && data.length > 0;
}

// Get count of users watching a business
export async function getWatchCount(businessId: string) {
  const { count, error } = await supabase
    .from('watchlist')
    .select('id', { count: 'exact' })
    .eq('business_id', businessId);
  
  if (error) throw error;
  return count || 0;
}

// Get all users watching a business
export async function getWatchingUsers(businessId: string) {
  const { data, error } = await supabase
    .from('watchlist')
    .select('user_id')
    .eq('business_id', businessId);
  
  if (error) throw error;
  return data?.map(entry => entry.user_id) || [];
}

// Add multiple businesses to watchlist
export async function addMultipleToWatchlist(userId: string, businessIds: string[]) {
  if (!businessIds.length) return [];
  
  // Create entries for each business
  const entries = businessIds.map(businessId => ({
    user_id: userId,
    business_id: businessId
  }));
  
  const { data, error } = await supabase
    .from('watchlist')
    .insert(entries)
    .select();
  
  if (error) throw error;
  return data || [];
}

// Remove multiple businesses from watchlist
export async function removeMultipleFromWatchlist(userId: string, businessIds: string[]) {
  if (!businessIds.length) return true;
  
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .in('business_id', businessIds);
  
  if (error) throw error;
  return true;
}

// Get most watched businesses
export async function getMostWatchedBusinesses(limit = 10) {
  // This requires a more complex query using SQL
  const { data, error } = await supabase.rpc('get_most_watched_businesses', { 
    limit_count: limit 
  });
  
  if (error) {
    console.error('Error fetching most watched businesses:', error.message);
    // Fallback to a client-side approach if the RPC function doesn't exist
    return fetchMostWatchedBusinessesFallback(limit);
  }
  
  return data || [];
}

// Fallback function if the RPC doesn't exist
async function fetchMostWatchedBusinessesFallback(limit = 10) {
  // First get all watchlist entries
  const { data: watchlistData, error: watchlistError } = await supabase
    .from('watchlist')
    .select('business_id');
  
  if (watchlistError) throw watchlistError;
  
  if (!watchlistData || watchlistData.length === 0) {
    return [];
  }
  
  // Count occurrences of each business_id
  const businessCounts = watchlistData.reduce((counts: Record<string, number>, entry) => {
    const id = entry.business_id;
    counts[id] = (counts[id] || 0) + 1;
    return counts;
  }, {});
  
  // Sort by count and take top N
  const topBusinessIds = Object.entries(businessCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
  
  if (topBusinessIds.length === 0) {
    return [];
  }
  
  // Fetch the business details
  const { data: businessesData, error: businessesError } = await supabase
    .from('businesses')
    .select('*')
    .in('id', topBusinessIds);
  
  if (businessesError) throw businessesError;
  
  // Sort the results according to the original count order
  return businessesData?.sort((a, b) => {
    const countA = businessCounts[a.id] || 0;
    const countB = businessCounts[b.id] || 0;
    return countB - countA;
  }) || [];
}
