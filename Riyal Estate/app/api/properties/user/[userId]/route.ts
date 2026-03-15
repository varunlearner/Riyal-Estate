import initDB from '@/lib/db/init';
import { Property } from '@/models/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        await initDB();

        const { userId } = params;
        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        // Status filter
        const status = searchParams.get('status');

        // Build query
        const query: any = { 'owner.userId': userId };

        if (status && status !== 'all') {
            query.status = status;
        }

        // Execute query
        const [properties, total] = await Promise.all([
            Property.find(query)
                .sort({ createdAt: -1 })
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
        console.error('Error fetching user properties:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user properties' },
            { status: 500 }
        );
    }
}
