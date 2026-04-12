import { NextRequest, NextResponse } from 'next/server';
import { Property } from '@/models/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    const properties = Property.findFeatured(limit);

    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured properties' },
      { status: 500 }
    );
  }
}

