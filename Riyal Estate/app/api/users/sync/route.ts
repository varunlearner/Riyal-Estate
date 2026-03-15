import { NextRequest, NextResponse } from 'next/server';
import initDB from '@/lib/db/init';
import { User } from '@/models/models';

export async function POST(request: NextRequest) {
  try {
    await initDB();

    const body = await request.json();
    const { firebaseUid, email, displayName, photoURL, phone, role = 'user' } = body;

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { success: false, error: 'Firebase UID and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update existing user
      user.displayName = displayName || user.displayName;
      user.photoURL = photoURL || user.photoURL;
      user.phone = phone || user.phone;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firebaseUid,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL,
        phone,
        role,
        isVerified: true,
      });
    }

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

