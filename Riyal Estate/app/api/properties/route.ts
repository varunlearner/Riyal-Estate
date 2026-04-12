import { Property } from '@/models/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Get all approved properties
    let properties = Property.findAll().filter((p: any) => p.status === 'approved');

    // Search by city
    const city = searchParams.get('city');
    if (city) {
      const cityLower = city.toLowerCase();
      properties = properties.filter((p: any) => p.address?.city?.toLowerCase().includes(cityLower));
    }

    // Search by locality
    const locality = searchParams.get('locality');
    if (locality) {
      const localityLower = locality.toLowerCase();
      properties = properties.filter((p: any) => p.address?.locality?.toLowerCase().includes(localityLower));
    }

    // Search query (title or description)
    const q = searchParams.get('q');
    if (q) {
      const qLower = q.toLowerCase();
      properties = properties.filter((p: any) => 
        p.title?.toLowerCase().includes(qLower) ||
        p.description?.toLowerCase().includes(qLower) ||
        p.address?.locality?.toLowerCase().includes(qLower)
      );
    }

    // Listing type (buy/rent)
    const listingType = searchParams.get('listingType');
    if (listingType && listingType !== 'all') {
      properties = properties.filter((p: any) => p.listingType === listingType);
    }

    // Property type
    const propertyType = searchParams.get('propertyType');
    if (propertyType) {
      const types = propertyType.split(',');
      properties = properties.filter((p: any) => types.includes(p.propertyType));
    }

    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      properties = properties.filter((p: any) => {
        const price = p.price || 0;
        if (minPrice && price < parseInt(minPrice)) return false;
        if (maxPrice && price > parseInt(maxPrice)) return false;
        return true;
      });
    }

    // Area range
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    if (minArea || maxArea) {
      properties = properties.filter((p: any) => {
        const area = p.area || 0;
        if (minArea && area < parseInt(minArea)) return false;
        if (maxArea && area > parseInt(maxArea)) return false;
        return true;
      });
    }

    // Bedrooms
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) {
      const bedroomList = bedrooms.split(',').map(b => parseInt(b));
      properties = properties.filter((p: any) => bedroomList.includes(p.bedrooms));
    }

    // Bathrooms
    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms) {
      const bathroomList = bathrooms.split(',').map(b => parseInt(b));
      properties = properties.filter((p: any) => bathroomList.includes(p.bathrooms));
    }

    // Furnished
    const furnished = searchParams.get('furnished');
    if (furnished) {
      const furnishedList = furnished.split(',');
      properties = properties.filter((p: any) => furnishedList.includes(p.furnished));
    }

    // Possession
    const possession = searchParams.get('possession');
    if (possession) {
      const possessionList = possession.split(',');
      properties = properties.filter((p: any) => possessionList.includes(p.possession));
    }

    // Amenities
    const amenities = searchParams.get('amenities');
    if (amenities) {
      const amenityList = amenities.split(',');
      properties = properties.filter((p: any) => 
        amenityList.every((a: string) => p.amenities?.includes(a))
      );
    }

    // Featured
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      properties = properties.filter((p: any) => p.isFeatured === true);
    }

    // Sort
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    properties.sort((a: any, b: any) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    const total = properties.length;
    const paginatedProperties = properties.slice(skip, skip + limit);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: paginatedProperties,
      count: paginatedProperties.length,
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
    const property = Property.create(propertyData);

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

