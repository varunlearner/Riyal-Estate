'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, MapPin, Home, DollarSign, Image as ImageIcon, 
  CheckCircle2, ArrowRight, ArrowLeft, Upload, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { 
  PROPERTY_TYPES, INDIAN_CITIES, BEDROOM_OPTIONS, 
  FURNISHED_OPTIONS, POSSESSION_OPTIONS, AMENITY_OPTIONS 
} from '@/types';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, title: 'Basic Info', icon: Building2 },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Details', icon: Home },
  { id: 4, title: 'Photos', icon: ImageIcon },
  { id: 5, title: 'Pricing', icon: DollarSign },
];

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    listingType: 'sale',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    furnished: 'unfurnished',
    possession: 'ready',
    possessionDate: '',
    floor: '',
    totalFloors: '',
    parking: '',
    age: '',
    address: {
      street: '',
      locality: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
    location: {
      lat: 0,
      lng: 0,
    },
    amenities: [] as string[],
    images: [] as string[],
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'properties');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          newImages.push(data.data.url);
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploadedImages(prev => [...prev, ...newImages]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/properties', {
        method: 'POST',
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
          owner: {
            userId: user.uid,
            name: user.displayName || '',
            phone: user.phoneNumber || '',
            email: user.email || '',
            photo: user.photoURL || '',
          },
        }),
      });

      if (response.ok) {
        toast.success('Property posted successfully!');
        router.push('/properties');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to post property');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
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
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Post Your Property</h1>
          <p className="text-gray-500">List your property for free and reach millions of buyers</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  currentStep >= step.id ? 'text-holy-600' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= step.id 
                      ? 'bg-holy-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-holy-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">I want to</label>
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="listingType"
                        value="sale"
                        checked={formData.listingType === 'sale'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formData.listingType === 'sale'
                          ? 'border-holy-600 bg-holy-50 text-holy-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <Building2 className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Sell</span>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="listingType"
                        value="rent"
                        checked={formData.listingType === 'rent'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formData.listingType === 'rent'
                          ? 'border-holy-600 bg-holy-50 text-holy-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <Home className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Rent</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., 2 BHK Apartment in Andheri West"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your property..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Location Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <select
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
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
                      placeholder="e.g., Andheri West"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="Full street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <Input
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">PIN Code</label>
                    <Input
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Landmark (Optional)</label>
                  <Input
                    name="address.landmark"
                    value={formData.address.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Property Details</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Balconies</label>
                    <select
                      name="balconies"
                      value={formData.balconies}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select</option>
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Parking</label>
                    <select
                      name="parking"
                      value={formData.parking}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select</option>
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Carpet Area (sq.ft)</label>
                    <Input
                      name="area"
                      type="number"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="e.g., 1000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Age</label>
                    <Input
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Floor Number</label>
                    <Input
                      name="floor"
                      type="number"
                      value={formData.floor}
                      onChange={handleChange}
                      placeholder="e.g., 3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Floors</label>
                    <Input
                      name="totalFloors"
                      type="number"
                      value={formData.totalFloors}
                      onChange={handleChange}
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Furnished Status</label>
                    <select
                      name="furnished"
                      value={formData.furnished}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
                    >
                      {FURNISHED_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Possession Status</label>
                    <select
                      name="possession"
                      value={formData.possession}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
                    >
                      {POSSESSION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITY_OPTIONS.slice(0, 12).map((amenity) => (
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
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Upload Photos</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Click to upload photos</p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB each</p>
                  </label>
                </div>

                {isUploading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-holy-600 mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                  </div>
                )}

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Pricing Details</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Price (₹)
                  </label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.price && `₹${parseInt(formData.price).toLocaleString('en-IN')}`}
                  </p>
                </div>

                <div className="bg-holy-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Property Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium capitalize">{formData.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listing Type</span>
                      <span className="font-medium capitalize">For {formData.listingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{formData.address.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area</span>
                      <span className="font-medium">{formData.area} sq.ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium">₹{parseInt(formData.price || '0').toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Photos</span>
                      <span className="font-medium">{formData.images.length} uploaded</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-holy-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    By posting this property, you agree to our Terms of Service and Privacy Policy. 
                    Your property will be reviewed by our team before being listed.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                >
                  Post Property
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
