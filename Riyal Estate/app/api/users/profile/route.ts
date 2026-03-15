import initDB from '@/lib/db/init';
import { Lead, Property, SavedProperty, User } from '@/models/models';
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
    await initDB();

    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile with counts
    const userDoc = await User.findOne({ firebaseUid: token });

    // If user doesn't exist, return empty profile (user will be created on sync)
    if (!userDoc) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'User profile not found. Please sync your account.',
      });
    }

    const user = userDoc.toObject();

    // Get counts
    const [savedCount, listingsCount, inquiriesCount] = await Promise.all([
      SavedProperty.countDocuments({ userId: userDoc._id.toString() }),
      Property.countDocuments({ 'owner.userId': userDoc._id.toString() }),
      Lead.countDocuments({ buyerId: userDoc._id.toString() }),
    ]);

    const profile = {
      ...user,
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
    await initDB();

    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const user = await User.findOneAndUpdate(
      { firebaseUid: token },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
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

