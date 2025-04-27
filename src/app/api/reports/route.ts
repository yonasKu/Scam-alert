import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ZodError } from 'zod';

// Import security middlewares
import { reportSchema } from '@/lib/validation/report-schema';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { validateImage, ImageValidationError } from '@/lib/middleware/image-validator';
import { validateCsrfToken } from '@/lib/middleware/csrf-protection';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Daily quota limit for reports per IP address
const DAILY_QUOTA_LIMIT = 3;

// Helper to get today's date string (YYYY-MM-DD)
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    // Step 1: Validate CSRF token
    const csrfError = validateCsrfToken(req);
    if (csrfError) return csrfError;
    
    // Step 2: Apply rate limiting
    const rateLimitError = await rateLimitMiddleware(req, 10); // Allow 10 requests per minute
    if (rateLimitError) return rateLimitError;
    
    // Step 3: Parse and validate the request body
    const rawData = await req.json();
    
    // Validate the report data using Zod schema
    const reportData = reportSchema.parse(rawData);
    
    // Step 4: Validate image if present
    if (reportData.image_url || reportData.photo_url || reportData.imageUrl) {
      const imageUrl = reportData.image_url || reportData.photo_url || reportData.imageUrl;
      if (imageUrl) {
        try {
          await validateImage(imageUrl);
        } catch (imageError) {
          if (imageError instanceof ImageValidationError) {
            return NextResponse.json({ 
              error: imageError.message 
            }, { status: imageError.status });
          }
          throw imageError; // Re-throw unexpected errors
        }
      }
    }
    
    // Step 5: Use IP address as a basic identifier for quota limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!ip || ip === 'unknown') {
      return NextResponse.json({ error: 'Unable to determine IP address' }, { status: 400 });
    }

    // Step 6: Check how many reports have been submitted from this IP today
    const today = getTodayDateString();
    const { count, error: countError } = await supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', `${today}T00:00:00Z`)
      .lte('created_at', `${today}T23:59:59Z`);

    if (countError) {
      return NextResponse.json({ error: 'Failed to check quota' }, { status: 500 });
    }
    
    if ((count ?? 0) >= DAILY_QUOTA_LIMIT) {
      return NextResponse.json({ error: 'daily_quota_exceeded' }, { status: 429 });
    }

    // Step 7: Insert the new report, attaching the IP address
    const { data, error } = await supabase
      .from('reports')
      .insert([{ ...reportData, ip }])
      .select();
      
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to insert report' }, { status: 500 });
    }
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    // Handle validation errors from Zod
    if (err instanceof ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: err.errors 
      }, { status: 400 });
    }
    
    // Log unexpected errors but don't expose details to client
    console.error('Report API error:', err);
    return NextResponse.json({ error: 'Server error processing request' }, { status: 500 });
  }
}
