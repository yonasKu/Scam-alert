import { supabase } from '../supabase';

// Type definitions
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  location?: string;
  created_at?: string;
  last_sign_in?: string;
  role?: UserRole;
}

// Get the current logged in user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get the user's profile from our custom users table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

// Get a user by ID
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Update user profile
export async function updateUserProfile(userId: string, userData: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Get all users (admin only)
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Create new user profile (called after sign up)
export async function createUserProfile(userData: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
