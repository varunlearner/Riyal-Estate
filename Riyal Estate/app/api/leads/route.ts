import { NextRequest, NextResponse } from 'next/server';
import initDB from '@/lib/db/init';
import { Lead, Property } from '@/models/models';

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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received'; // 'received' or 'sent'

    const query = type === 'received' 
      ? { sellerId: token } 
      : { buyerId: token };

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
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
    const { propertyId, message, buyerName, buyerEmail, buyerPhone } = body;

    if (!propertyId || !message) {
      return NextResponse.json(
        { success: false, error: 'Property ID and message are required' },
        { status: 400 }
      );
    }

    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create lead
    const lead = await Lead.create({
      propertyId,
      propertyTitle: property.title,
      buyerId: token,
      buyerName: buyerName || '',
      buyerEmail: buyerEmail || '',
      buyerPhone: buyerPhone || '',
      sellerId: property.owner.userId,
      sellerName: property.owner.name,
      sellerEmail: property.owner.email,
      sellerPhone: property.owner.phone,
      message,
      status: 'new',
    });

    // Increment property inquiries count
    await Property.findByIdAndUpdate(propertyId, { $inc: { inquiries: 1 } });

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Inquiry sent successfully',
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create lead' },
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
    const { leadId, status, notes } = body;

    const lead = await Lead.findOneAndUpdate(
      { _id: leadId, $or: [{ buyerId: token }, { sellerId: token }] },
      { status, notes, updatedAt: new Date() },
      { new: true }
    );

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

