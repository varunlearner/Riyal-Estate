'use client';

import { Button } from '@/components/ui/button';
import { formatArea, formatPrice } from '@/lib/utils';
import { IProperty } from '@/types';
import { ArrowRight, Building2, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-holy-600" /></div>}>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const propertyIds = searchParams.get('ids')?.split(',') || [];

  useEffect(() => {
    if (propertyIds.length > 0) {
      fetchProperties();
    } else {
      setIsLoading(false);
    }
  }, [propertyIds]);

  const fetchProperties = async () => {
    try {
      const fetchedProperties: IProperty[] = [];
      for (const id of propertyIds) {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          fetchedProperties.push(data.data);
        }
      }
      setProperties(fetchedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProperty = (id: string) => {
    const newIds = propertyIds.filter(pid => pid !== id);
    window.history.replaceState(null, '', `/compare?ids=${newIds.join(',')}`);
    setProperties(properties.filter(p => p._id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-holy-600" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Properties to Compare</h1>
          <p className="text-gray-500 mb-6">Select properties to compare from the search page</p>
          <Link href="/search">
            <Button>
              Browse Properties
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  interface ComparisonField {
    label: string;
    key: keyof IProperty;
    format: (v: any) => string | number;
  }

  const comparisonFields: ComparisonField[] = [
    { label: 'Price', key: 'price', format: (v: any) => formatPrice(v) },
    { label: 'Area', key: 'area', format: (v: any) => formatArea(v) },
    { label: 'Bedrooms', key: 'bedrooms', format: (v: any) => v ? `${v} BHK` : '-' },
    { label: 'Bathrooms', key: 'bathrooms', format: (v: any) => v || '-' },
    { label: 'Furnished', key: 'furnished', format: (v: any) => v ? v.charAt(0).toUpperCase() + v.slice(1) : '-' },
    { label: 'Possession', key: 'possession', format: (v: any) => v === 'ready' ? 'Ready to Move' : 'Under Construction' },
    { label: 'Property Type', key: 'propertyType', format: (v: any) => v ? v.charAt(0).toUpperCase() + v.slice(1) : '-' },
    { label: 'Listing Type', key: 'listingType', format: (v: any) => v === 'sale' ? 'For Sale' : 'For Rent' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Compare Properties</h1>
            <p className="text-gray-500">Compare {properties.length} properties side by side</p>
          </div>
          <Link href="/search">
            <Button variant="outline">
              Back to Search
            </Button>
          </Link>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="grid" style={{ gridTemplateColumns: `150px repeat(${properties.length}, minmax(250px, 1fr))` }}>
            {/* Header Row */}
            <div className="p-4 font-semibold text-gray-500">Feature</div>
            {properties.map((property) => (
              <div key={property._id} className="p-4 relative">
                <button
                  onClick={() => removeProperty(property._id)}
                  className="absolute top-2 right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-gray-200">
                  {property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm line-clamp-2">{property.title}</h3>
                <p className="text-xs text-gray-500">{property.address.locality}</p>
              </div>
            ))}

            {/* Price Row */}
            <div className="p-4 font-medium bg-gray-50">Price</div>
            {properties.map((property) => (
              <div key={property._id} className="p-4 bg-gray-50">
                <p className="text-holy-600 font-bold">{formatPrice(property.price)}</p>
              </div>
            ))}

            {/* Comparison Rows */}
            {comparisonFields.slice(1).map((field) => (
              <>
                <div key={field.key} className="p-4 font-medium border-t">{field.label}</div>
                {properties.map((property) => (
                  <div key={`${property._id}-${field.key}`} className="p-4 border-t">
                    <p>{field.format((property as any)[field.key])}</p>
                  </div>
                ))}
              </>
            ))}

            {/* Amenities Row */}
            <div className="p-4 font-medium border-t">Amenities</div>
            {properties.map((property) => (
              <div key={`${property._id}-amenities`} className="p-4 border-t">
                <div className="flex flex-wrap gap-1">
                  {property.amenities.slice(0, 5).map((amenity) => (
                    <span key={amenity} className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 5 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      +{property.amenities.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Action Row */}
            <div className="p-4 font-medium border-t">Action</div>
            {properties.map((property) => (
              <div key={`${property._id}-action`} className="p-4 border-t">
                <Link href={`/property/${property._id}`}>
                  <Button size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
