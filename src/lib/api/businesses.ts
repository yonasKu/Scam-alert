import { supabase } from '../supabase';

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
