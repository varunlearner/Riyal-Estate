import Property from '@/models/Property';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        // Status filter
        const status = searchParams.get('status');

        // Get all properties from user
        const allProperties = Property.findByOwner(userId);

        // Filter by status if provided
        let filtered = allProperties;
        if (status && status !== 'all') {
            filtered = allProperties.filter((p: any) => p.status === status);
        }

        // Sort by created date (newest first)
        filtered.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const total = filtered.length;
        const properties = filtered.slice(skip, skip + limit);
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
        console.error('Error fetching user properties:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user properties' },
            { status: 500 }
        );
    }
}
