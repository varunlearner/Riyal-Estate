import initDB from '@/lib/db/init';
import { Property } from '@/models/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await initDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { status: 'approved' };

    // Search by city
    const city = searchParams.get('city');
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    // Search by locality
    const locality = searchParams.get('locality');
    if (locality) {
      query['address.locality'] = { $regex: locality, $options: 'i' };
    }

    // Search query (title or description)
    const q = searchParams.get('q');
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'address.locality': { $regex: q, $options: 'i' } },
      ];
    }

    // Listing type (buy/rent)
    const listingType = searchParams.get('listingType');
    if (listingType && listingType !== 'all') {
      query.listingType = listingType;
    }

    // Property type
    const propertyType = searchParams.get('propertyType');
    if (propertyType) {
      query.propertyType = { $in: propertyType.split(',') };
    }

    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Area range
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = parseInt(minArea);
      if (maxArea) query.area.$lte = parseInt(maxArea);
    }

    // Bedrooms
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) {
      query.bedrooms = { $in: bedrooms.split(',').map(b => parseInt(b)) };
    }

    // Bathrooms
    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms) {
      query.bathrooms = { $in: bathrooms.split(',').map(b => parseInt(b)) };
    }

    // Furnished
    const furnished = searchParams.get('furnished');
    if (furnished) {
      query.furnished = { $in: furnished.split(',') };
    }

    // Possession
    const possession = searchParams.get('possession');
    if (possession) {
      query.possession = { $in: possession.split(',') };
    }

    // Amenities
    const amenities = searchParams.get('amenities');
    if (amenities) {
      query.amenities = { $all: amenities.split(',') };
    }

    // Featured
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sort
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(query),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB();

    const body = await request.json();

    // Validate required fields (reduced from original)
    const requiredFields = ['title', 'description', 'propertyType', 'listingType', 'price', 'area', 'owner'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate owner has required fields
    if (!body.owner.userId || !body.owner.email) {
      return NextResponse.json(
        { success: false, error: 'Owner userId and email are required' },
        { status: 400 }
      );
    }

    // Validate address has required fields
    if (!body.address?.city || !body.address?.locality) {
      return NextResponse.json(
        { success: false, error: 'Address city and locality are required' },
        { status: 400 }
      );
    }

    // Set default values for optional fields
    const propertyData = {
      ...body,
      status: 'pending', // All new properties are pending approval
      location: body.location || { lat: 0, lng: 0 },
      images: body.images || [],
      amenities: body.amenities || [],
      address: {
        street: body.address?.street || '',
        locality: body.address?.locality || '',
        city: body.address?.city || '',
        state: body.address?.state || '',
        pincode: body.address?.pincode || '',
        landmark: body.address?.landmark || '',
      },
      owner: {
        userId: body.owner.userId,
        name: body.owner.name || 'Property Owner',
        phone: body.owner.phone || '',
        email: body.owner.email,
        photo: body.owner.photo || '',
      },
    };

    // Create property
    const property = await Property.create(propertyData);

    return NextResponse.json(
      { success: true, data: property, message: 'Property created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}

