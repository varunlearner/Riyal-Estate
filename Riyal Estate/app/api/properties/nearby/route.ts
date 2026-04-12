import { Property } from '@/models/models';
import { NextRequest, NextResponse } from 'next/server';

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get coordinates and radius from query params
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radiusKm = parseFloat(searchParams.get('radius') || '5'); // default 5km
    const limit = parseInt(searchParams.get('limit') || '20');

    if (lat === 0 || lng === 0) {
      return NextResponse.json(
        { error: 'Valid latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Get all approved properties
    let properties = Property.findAll().filter((p: any) => p.status === 'approved');

    // Filter properties within the radius
    const nearbyProperties = properties
      .map((p: any) => {
        const propertyLat = p.coordinates?.lat || p.address?.coordinates?.lat;
        const propertyLng = p.coordinates?.lng || p.address?.coordinates?.lng;

        // Skip properties without coordinates
        if (!propertyLat || !propertyLng) {
          return null;
        }

        const distance = calculateDistance(lat, lng, propertyLat, propertyLng);

        // Include only properties within radius
        if (distance <= radiusKm) {
          return {
            ...p,
            distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          };
        }
        return null;
      })
      .filter((p): p is any => p !== null)
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: nearbyProperties,
      count: nearbyProperties.length,
      searchParams: {
        latitude: lat,
        longitude: lng,
        radiusKm: radiusKm,
      },
    });
  } catch (error) {
    console.error('Error searching nearby properties:', error);
    return NextResponse.json(
      { error: 'Failed to search nearby properties' },
      { status: 500 }
    );
  }
}
