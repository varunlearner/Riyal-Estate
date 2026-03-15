import { NextRequest, NextResponse } from 'next/server';
import initDB from '@/lib/db/init';
import { Property } from '@/models/models';

export async function GET(request: NextRequest) {
  try {
    await initDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    const properties = await Property.find({
      status: 'approved',
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

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

