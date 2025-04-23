import { NextResponse } from 'next/server';
import { 
  getAllBusinessesWithScores,
  getBusinessesByScamScoreRange,
  getHighRiskBusinesses
} from '@/lib/api/businesses';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minScore = searchParams.get('minScore') ? parseFloat(searchParams.get('minScore') as string) : undefined;
    const maxScore = searchParams.get('maxScore') ? parseFloat(searchParams.get('maxScore') as string) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 20;
    
    // If min and max score are provided, get businesses in that range
    let businesses;
    if (minScore !== undefined && maxScore !== undefined) {
      businesses = await getBusinessesByScamScoreRange(minScore, maxScore, limit);
    } else if (minScore !== undefined) {
      // If only min score is provided, get businesses with scores >= minScore
      businesses = await getBusinessesByScamScoreRange(minScore, 10, limit);
    } else if (maxScore !== undefined) {
      // If only max score is provided, get businesses with scores <= maxScore
      businesses = await getBusinessesByScamScoreRange(0, maxScore, limit);
    } else {
      // Otherwise get all businesses with scores
      businesses = await getAllBusinessesWithScores(limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        businesses,
        count: businesses.length,
        filters: {
          minScore,
          maxScore,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Error in test-business-scores API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
