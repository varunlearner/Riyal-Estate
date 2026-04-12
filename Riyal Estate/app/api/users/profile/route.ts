import { Lead, Property, SavedProperty } from '@/models/models';
import { NextRequest, NextResponse } from 'next/server';

// Middleware to verify Firebase token
async function verifyToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  // In production, verify the Firebase token here
  // For now, we'll extract the UID from the header
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

    // Get counts for this user
    const savedCount = SavedProperty.findByUser(token).length;
    const listingsCount = Property.findByOwner(token).length;
    const inquiriesCount = Lead.findByBuyer(token).length;

    const profile = {
      userId: token,
      savedPropertiesCount: savedCount,
      listingsCount,
      inquiriesCount,
    };

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // For now, just return the updated data (in production, persist to database)
    const profile = {
      userId: token,
      ...body,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

