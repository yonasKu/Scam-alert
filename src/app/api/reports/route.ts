import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to get today's date string (YYYY-MM-DD)
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const reportData = await req.json();
    // Use IP address as a basic identifier for quota limiting
    // Only use x-forwarded-for as NextRequest does not have .ip
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!ip || ip === 'unknown') {
      return NextResponse.json({ error: 'Unable to determine IP address' }, { status: 400 });
    }

    // Check how many reports have been submitted from this IP today
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
    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'daily_quota_exceeded' }, { status: 429 });
    }

    // Insert the new report, attaching the IP address
    const { data, error } = await supabase
      .from('reports')
      .insert([{ ...reportData, ip }])
      .select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
