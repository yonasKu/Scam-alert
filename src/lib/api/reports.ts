import { supabase } from '../supabase';

// Type definitions
export type ReportType = 'price_gouging' | 'no_receipt' | 'suspicious_activity' | 'unauthorized_charges';

export interface Report {
  id?: string;
  title: string;
  business_name: string;
  location: string;
  report_type: ReportType;
  description: string;
  price_before?: number;
  price_after?: number;
  receipt_issue_type?: string;
  suspicious_activity_type?: string;
  unauthorized_issue_type?: string;
  reporter_contact?: string;
  created_at?: string;
  user_id?: string;
}

// Submit a new report
export async function submitReport(reportData: Report) {
  const { data, error } = await supabase
    .from('reports')
    .insert(reportData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Fetch all reports
export async function fetchReports() {
  console.log('Fetching reports from Supabase...');
  
  // First check if the table exists and is accessible
  const { error: tableError } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true });
  
  if (tableError) {
    console.error('Error checking reports table:', tableError.message);
    throw tableError;
  }
  
  // Now fetch the actual data
  const { data, error, count } = await supabase
    .from('reports')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching reports:', error.message);
    throw error;
  }
  
  console.log(`Successfully fetched ${count || 0} reports:`, data);
  return data || [];
}

// Fetch a single report by ID
export async function fetchReportById(id: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Fetch reports by business name
export async function fetchReportsByBusiness(businessName: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .ilike('business_name', `%${businessName}%`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Fetch reports by report type
export async function fetchReportsByType(reportType: ReportType) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('report_type', reportType)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
