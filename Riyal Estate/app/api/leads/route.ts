import { NextRequest, NextResponse } from 'next/server';
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
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received'; // 'received' or 'sent'

    let leads: any[] = [];
    if (type === 'received') {
      leads = Lead.findBySeller(token);
    } else {
      leads = Lead.findByBuyer(token);
    }

    // Sort by createdAt descending
    leads.sort((a: any, b: any) => 
      new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );

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
    const property = Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create lead
    const lead = Lead.create({
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
    const currentProp = Property.findById(propertyId);
    if (currentProp) {
      Property.update(propertyId, { inquiries: (currentProp.inquiries || 0) + 1 });
    }

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
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { leadId, status, notes } = body;

    const lead = Lead.findById(leadId);
    
    if (!lead || (lead.buyerId !== token && lead.sellerId !== token)) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const updatedLead = Lead.update(leadId, { status, notes, updatedAt: new Date() });

    return NextResponse.json({
      success: true,
      data: updatedLead,
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

