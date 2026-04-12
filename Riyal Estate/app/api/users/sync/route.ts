import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, email, displayName, photoURL, phone, role = 'user' } = body;

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { success: false, error: 'Firebase UID and email are required' },
        { status: 400 }
      );
    }

    // Create user object
    const user = {
      firebaseUid,
      email,
      displayName: displayName || email.split('@')[0],
      photoURL,
      phone,
      role,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User synced successfully',
    });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync user' },
      { status: 500 }
    );
  }
}

