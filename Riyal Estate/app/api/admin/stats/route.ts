import { NextRequest, NextResponse } from 'next/server';
import { Property, Lead } from '@/models/models';

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }
  // In production, verify the Firebase token and check if user is admin
  // For now, we'll return true for development
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get counts from JSON database
    const totalProperties = Property.findAll().length;
    const pendingProperties = Property.findAll().filter((p: any) => p.status === 'pending').length;
    const totalLeads = Lead.findAll().length;
    const featuredProperties = Property.findAll().filter((p: any) => p.isFeatured).length;

    // Get properties by status
    const statusCounts: { [key: string]: number } = {};
    Property.findAll().forEach((p: any) => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });

    // Get properties by city (top 10)
    const cityCounts: { [key: string]: number } = {};
    Property.findAll().forEach((p: any) => {
      const city = p.address?.city || 'Unknown';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([city, count]) => ({ city, count }));

    return NextResponse.json({
      success: true,
      data: {
        totalProperties,
        pendingProperties,
        totalLeads,
        featuredProperties,
        propertiesByStatus: statusCounts,
        topCities,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

