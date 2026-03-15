'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Building2, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserProperties } from '@/hooks/useProperties';
import { formatPrice, getStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MyPropertiesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { properties, isLoading: propertiesLoading, mutate } = useUserProperties(user?.uid || '');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Property deleted successfully');
        mutate();
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-holy-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Properties</h1>
            <p className="text-gray-500">Manage your property listings</p>
          </div>
          <Link href="/add-property">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post New Property
            </Button>
          </Link>
        </div>

        {/* Properties List */}
        {propertiesLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="space-y-4">
            {properties.map((property) => (
              <Card key={property._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-48 h-48 md:h-auto relative bg-gray-200">
                      {property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(property.status)}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                            </Badge>
                            {property.isFeatured && (
                              <Badge className="bg-orange-500">Featured</Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
                          <p className="text-gray-500 text-sm mb-2">
                            {property.address.locality}, {property.address.city}
                          </p>
                          <p className="text-holy-600 font-bold text-lg">
                            {formatPrice(property.price)}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold">{property.views}</p>
                            <p className="text-gray-500">Views</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{property.inquiries}</p>
                            <p className="text-gray-500">Inquiries</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{property.shortlists}</p>
                            <p className="text-gray-500">Shortlists</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Link href={`/property/${property._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/edit-property/${property._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(property._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No properties yet</h2>
            <p className="text-gray-500 mb-6">Start by posting your first property listing</p>
            <Link href="/add-property">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post Property
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
