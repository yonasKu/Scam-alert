import { NextResponse } from 'next/server';
import { 
  getHighRiskBusinesses,
  getRecentlyReportedBusinesses,
  getTrendingBusinesses,
  getBusinessesToWatch
} from '@/lib/api/businesses';

export async function GET() {
  try {
    // Test all our new functions
    const [highRisk, recent, trending, combined] = await Promise.all([
      getHighRiskBusinesses(5),
      getRecentlyReportedBusinesses(5),
      getTrendingBusinesses(5),
      getBusinessesToWatch(10)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        highRiskBusinesses: highRisk,
        recentlyReportedBusinesses: recent,
        trendingBusinesses: trending,
        businessesToWatch: combined
      },
      message: 'Successfully retrieved businesses to watch'
    });
  } catch (error) {
    console.error('Error testing businesses to watch:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve businesses to watch'
    }, { status: 500 });
  }
}
