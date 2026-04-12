import { NextRequest, NextResponse } from 'next/server';
import initDB from '@/lib/db/init';
import { Property } from '@/models/models';

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  try {
    await initDB();

    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get all properties
    let properties = Property.findAll();

    // Filter by status if provided
    if (status) {
      properties = properties.filter((p: any) => p.status === status);
    }

    const total = properties.length;

    // Sort by created date (newest first)
    properties.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const paginatedProperties = properties.slice(skip, skip + limit);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: paginatedProperties,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initDB();

    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId, status, isFeatured, featuredUntil } = body;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (featuredUntil) updateData.featuredUntil = featuredUntil;

    const property = Property.update(propertyId, updateData);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
      message: 'Property updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initDB();

    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('id');

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const property = Property.findById(propertyId);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    Property.delete(propertyId);

    Property.delete(propertyId);

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}

