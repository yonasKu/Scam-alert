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
