import { NextRequest, NextResponse } from 'next/server';
import Property from '@/models/Property';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const property = Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Increment views
    if (property) {
      Property.update(id, { views: (property.views || 0) + 1 });
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const property = Property.update(id, { ...body, updatedAt: new Date() });

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = Property.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

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
