import { NextRequest, NextResponse } from 'next/server';
import initDB from '@/lib/db/init';
import { SavedProperty, Property } from '@/models/models';

async function verifyToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split('Bearer ')[1];
}

export async function GET(request: NextRequest) {
  try {
    await initDB();

    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const savedProperties = await SavedProperty.find({ userId: token })
      .sort({ createdAt: -1 })
      .lean();

    const propertyIds = savedProperties.map((sp) => sp.propertyId);
    const properties = await Property.find({
      _id: { $in: propertyIds },
      status: { $in: ['approved', 'sold', 'rented'] },
    }).lean();

    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB();

    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Check if already saved
    const existing = await SavedProperty.findOne({
      userId: token,
      propertyId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Property already saved' },
        { status: 400 }
      );
    }

    const savedProperty = await SavedProperty.create({
      userId: token,
      propertyId,
    });

    // Increment property shortlists count
    await Property.findByIdAndUpdate(propertyId, { $inc: { shortlists: 1 } });

    return NextResponse.json({
      success: true,
      data: savedProperty,
      message: 'Property saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving property:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save property' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initDB();

    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    await SavedProperty.findOneAndDelete({
      userId: token,
      propertyId,
    });

    // Decrement property shortlists count
    await Property.findByIdAndUpdate(propertyId, { $inc: { shortlists: -1 } });

    return NextResponse.json({
      success: true,
      message: 'Property removed from saved',
    });
  } catch (error) {
    console.error('Error removing saved property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove saved property' },
      { status: 500 }
    );
  }
}

