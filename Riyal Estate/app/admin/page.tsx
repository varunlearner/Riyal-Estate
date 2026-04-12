'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { AdminStats } from '@/types';
import {
  Building2,
  CheckCircle2,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/users',
    },
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Building2,
      color: 'bg-green-500',
      href: '/admin/properties',
    },
    {
      title: 'Pending Approval',
      value: stats?.pendingProperties || 0,
      icon: CheckCircle2,
      color: 'bg-yellow-500',
      href: '/admin/properties?status=pending',
    },
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      href: '/admin/leads',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your platform</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/properties">
              <Button variant="outline">
                <Building2 className="h-4 w-4 mr-2" />
                Manage Properties
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Properties by Status</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats.propertiesByStatus && (
                <div className="space-y-4">
                  {Object.entries(stats.propertiesByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={
                          status === 'approved' ? 'bg-green-500' :
                            status === 'pending' ? 'bg-yellow-500' :
                              status === 'rejected' ? 'bg-red-500' :
                                'bg-blue-500'
                        }>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Users by Role */}
          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats.usersByRole && (
                <div className="space-y-4">
                  {Object.entries(stats.usersByRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-brand-600" />
                        </div>
                        <span className="capitalize">{role}s</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Cities */}
          <Card>
            <CardHeader>
              <CardTitle>Top Cities</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats.propertiesByCity && (
                <div className="space-y-4">
                  {stats.propertiesByCity.slice(0, 5).map((city) => (
                    <div key={city.city} className="flex items-center justify-between">
                      <span>{city.city}</span>
                      <span className="font-semibold">{city.count} properties</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/properties?status=pending">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Pending Properties
                  {(stats?.pendingProperties ?? 0) > 0 && (
                    <Badge className="ml-auto bg-yellow-500">{stats?.pendingProperties}</Badge>
                  )}
                </Button>
              </Link>
              <Link href="/admin/properties?status=approved">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Feature Properties
                </Button>
              </Link>
              <Link href="/admin/leads">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View All Leads
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
