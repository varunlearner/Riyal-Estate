'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProperty } from '@/hooks/useProperties';
import { PROPERTY_TYPES, INDIAN_CITIES, BEDROOM_OPTIONS, FURNISHED_OPTIONS, POSSESSION_OPTIONS, AMENITY_OPTIONS } from '@/types';
import toast from 'react-hot-toast';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { property, isLoading: propertyLoading } = useProperty(id as string);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        listingType: property.listingType,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        balconies: property.balconies || '',
        furnished: property.furnished,
        possession: property.possession,
        floor: property.floor || '',
        totalFloors: property.totalFloors || '',
        parking: property.parking || '',
        age: property.age || '',
        address: property.address,
        amenities: property.amenities,
        images: property.images,
      });
    }
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev: any) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          area: parseInt(formData.area),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          balconies: formData.balconies ? parseInt(formData.balconies) : undefined,
          floor: formData.floor ? parseInt(formData.floor) : undefined,
          totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
          parking: formData.parking ? parseInt(formData.parking) : undefined,
        }),
      });

      if (response.ok) {
        toast.success('Property updated successfully!');
        router.push('/properties');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update property');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || propertyLoading || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-holy-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Property</h1>
            <p className="text-gray-500">Update your property listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Property Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 outline-none"
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Listing Type</label>
                    <select
                      name="listingType"
                      value={formData.listingType}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 outline-none"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Pricing & Area</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (₹)</label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area (sq.ft)</label>
                    <Input
                      name="area"
                      type="number"
                      value={formData.area}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 outline-none"
                    >
                      <option value="">Select</option>
                      {BEDROOM_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <select
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 outline-none"
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Furnished</label>
                    <select
                      name="furnished"
                      value={formData.furnished}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 outline-none"
                    >
                      {FURNISHED_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Possession</label>
                    <select
                      name="possession"
                      value={formData.possession}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 outline-none"
                    >
                      {POSSESSION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <select
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 outline-none"
                    >
                      <option value="">Select City</option>
                      {INDIAN_CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Locality</label>
                    <Input
                      name="address.locality"
                      value={formData.address.locality}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <Input
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {AMENITY_OPTIONS.slice(0, 16).map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-gray-300 text-holy-600 focus:ring-holy-500"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
