'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Bed, Bath, Maximize, CheckCircle2, Star, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IProperty } from '@/types';
import { formatPrice, formatArea, truncateText } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface PropertyCardProps {
  property: IProperty;
  showActions?: boolean;
}

export default function PropertyCard({ property, showActions = true }: PropertyCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save properties');
      return;
    }

    setIsLoading(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/users/saved-properties', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId: property._id }),
      });

      if (response.ok) {
        setIsSaved(!isSaved);
        toast.success(isSaved ? 'Property removed from saved' : 'Property saved successfully');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to contact owner');
      return;
    }

    // Open contact modal or redirect to contact page
    window.open(`tel:${property.owner.phone}`, '_self');
  };

  return (
    <Link href={`/property/${property._id}`}>
      <div className="property-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0] || '/images/property-placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {property.isFeatured && (
              <Badge className="featured-badge text-white">
                <Star className="h-3 w-3 mr-1 fill-white" />
                Featured
              </Badge>
            )}
            <Badge className={property.listingType === 'sale' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}>
              {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
          </div>

          {/* Save Button */}
          {showActions && (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                isSaved
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          )}

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3">
            <div className="price-tag text-white px-3 py-1.5 rounded-lg font-bold text-lg">
              {formatPrice(property.price)}
            </div>
          </div>

          {/* Verified Badge */}
          {property.status === 'approved' && (
            <div className="absolute bottom-3 right-3">
              <div className="verified-badge text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1" title={property.title}>
            {truncateText(property.title, 50)}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {property.address.locality}, {property.address.city}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} BHK</span>
              </div>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{formatArea(property.area)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-brand-700 text-xs font-semibold">
                  {property.owner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600 truncate max-w-[100px]">
                {property.owner.name}
              </span>
            </div>

            {showActions && (
              <button
                onClick={handleContact}
                className="flex items-center gap-1 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                Contact
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
