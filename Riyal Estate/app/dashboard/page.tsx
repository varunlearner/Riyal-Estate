'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, Heart, MessageSquare, TrendingUp, 
  Plus, Eye, ArrowRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserProperties } from '@/hooks/useProperties';
import PropertyCard from '@/components/property/PropertyCard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, isAuthenticated, isLoading } = useAuth();
  const { properties, isLoading: propertiesLoading } = useUserProperties(user?.uid || '');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  const stats = [
    {
      title: 'My Listings',
      value: userProfile?.listingsCount || 0,
      icon: Building2,
      href: '/properties',
      color: 'bg-blue-500',
    },
    {
      title: 'Saved Properties',
      value: userProfile?.savedPropertiesCount || 0,
      icon: Heart,
      href: '/saved',
      color: 'bg-red-500',
    },
    {
      title: 'Inquiries',
      value: userProfile?.inquiriesCount || 0,
      icon: MessageSquare,
      href: '/inquiries',
      color: 'bg-green-500',
    },
    {
      title: 'Total Views',
      value: properties.reduce((acc, p) => acc + (p.views || 0), 0),
      icon: Eye,
      href: '/properties',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.displayName}</p>
          </div>
          <Link href="/add-property">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post New Property
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Listings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Listings</CardTitle>
                <Link href="/properties">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse" />
                    ))}
                  </div>
                ) : properties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {properties.slice(0, 4).map((property) => (
                      <PropertyCard key={property._id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-gray-500 mb-4">Start by posting your first property</p>
                    <Link href="/add-property">
                      <Button>Post Property</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/add-property">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Property
                  </Button>
                </Link>
                <Link href="/saved">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    View Saved Properties
                  </Button>
                </Link>
                <Link href="/inquiries">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Inquiries
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property._id} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <Eye className="h-5 w-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{property.title}</p>
                        <p className="text-xs text-gray-500">
                          {property.views} views • {property.inquiries} inquiries
                        </p>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
