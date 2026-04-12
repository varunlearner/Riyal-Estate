import { NextRequest, NextResponse } from 'next/server';
import SavedProperty from '@/models/SavedProperty';
import Property from '@/models/Property';

async function verifyToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split('Bearer ')[1];
}

export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const savedProperties = SavedProperty.findByUser(token)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const propertyIds = savedProperties.map((sp: any) => sp.propertyId);
    const allProperties = Property.findAll();
    const properties = allProperties.filter((p: any) => 
      propertyIds.includes(p._id) && ['approved', 'sold', 'rented'].includes(p.status)
    );

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

    const existing = SavedProperty.findByUserAndProperty(token, propertyId);

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Property already saved' },
        { status: 400 }
      );
    }

    const savedProperty = SavedProperty.create(token, propertyId);

    const currentProp = Property.findById(propertyId);
    if (currentProp) {
      Property.update(propertyId, { shortlists: (currentProp.shortlists || 0) + 1 });
    }

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

    SavedProperty.deleteByUserAndProperty(token, propertyId);

    const currentProp = Property.findById(propertyId);
    if (currentProp) {
      Property.update(propertyId, { shortlists: Math.max(0, (currentProp.shortlists || 1) - 1) });
    }

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
