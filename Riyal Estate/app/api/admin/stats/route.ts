import { NextRequest, NextResponse } from 'next/server';
import initDB from '@/lib/db/init';
import { User, Property, Lead } from '@/models/models';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shubhholyacres@gmail.com';

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
    await initDB();

    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get counts
    const [
      totalUsers,
      totalProperties,
      pendingProperties,
      totalLeads,
      featuredProperties,
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ status: 'pending' }),
      Lead.countDocuments(),
      Property.countDocuments({ isFeatured: true }),
    ]);

    // Get users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const usersByRoleMap: { [key: string]: number } = {
      user: 0,
      owner: 0,
      agent: 0,
      admin: 0,
    };
    usersByRole.forEach((item) => {
      usersByRoleMap[item._id] = item.count;
    });

    // Get properties by status
    const propertiesByStatus = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const propertiesByStatusMap: { [key: string]: number } = {
      pending: 0,
      approved: 0,
      rejected: 0,
      sold: 0,
      rented: 0,
    };
    propertiesByStatus.forEach((item) => {
      propertiesByStatusMap[item._id] = item.count;
    });

    // Get properties by city (top 10)
    const propertiesByCity = await Property.aggregate([
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get monthly stats for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Property.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          properties: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          leads: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          users: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Combine monthly stats
    const monthlyStatsMap = new Map();
    [...monthlyStats, ...monthlyLeads, ...monthlyUsers].forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!monthlyStatsMap.has(key)) {
        monthlyStatsMap.set(key, {
          month: `${item._id.month}/${item._id.year}`,
          properties: 0,
          leads: 0,
          users: 0,
        });
      }
      const existing = monthlyStatsMap.get(key);
      if (item.properties) existing.properties = item.properties;
      if (item.leads) existing.leads = item.leads;
      if (item.users) existing.users = item.users;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        pendingProperties,
        totalLeads,
        featuredProperties,
        totalRevenue: 0, // Will be calculated from payments
        usersByRole: usersByRoleMap,
        propertiesByStatus: propertiesByStatusMap,
        propertiesByCity: propertiesByCity.map((item) => ({
          city: item._id,
          count: item.count,
        })),
        monthlyStats: Array.from(monthlyStatsMap.values()),
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

