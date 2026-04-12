'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, Bed, Bath, Maximize,
  Phone, Mail, Heart, Share2, ChevronLeft, ChevronRight,
  Home, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatArea, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const params = useParams();
  const { id } = params;
  const { user, isAuthenticated } = useAuth();
  const { property, isLoading, isError } = useProperty(id as string);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-holy-600" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
          <p className="text-gray-500 mb-4">The property you are looking for does not exist.</p>
          <Link href="/search">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to contact the owner');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: property._id,
          message: contactMessage,
          buyerName: user?.displayName,
          buyerEmail: user?.email,
        }),
      });

      if (response.ok) {
        toast.success('Your inquiry has been sent!');
        setShowContactForm(false);
        setContactMessage('');
      } else {
        toast.error('Failed to send inquiry');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property on HolyEstates: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-[400px] md:h-[500px] bg-gray-900">
        {property.images.length > 0 && (
          <Image
            src={property.images[currentImageIndex]}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
          {currentImageIndex + 1} / {property.images.length}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={property.listingType === 'sale' ? 'bg-blue-500' : 'bg-purple-500'}>
            For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
          </Badge>
          {property.isFeatured && (
            <Badge className="bg-orange-500">Featured</Badge>
          )}
          {property.status === 'approved' && (
            <Badge className="bg-green-500">Verified</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{property.address.street}, {property.address.locality}, {property.address.city}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-holy-600">
                {formatPrice(property.price)}
              </div>
              {property.pricePerSqFt && (
                <div className="text-gray-500">
                  ₹{property.pricePerSqFt.toLocaleString('en-IN')} per sq.ft
                </div>
              )}
            </div>

            {/* Key Details */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {property.bedrooms !== undefined && property.bedrooms > 0 && (
                    <div className="text-center">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-holy-600" />
                      <p className="font-semibold">{property.bedrooms} BHK</p>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                    </div>
                  )}
                  {property.bathrooms !== undefined && property.bathrooms > 0 && (
                    <div className="text-center">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-holy-600" />
                      <p className="font-semibold">{property.bathrooms}</p>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                    </div>
                  )}
                  <div className="text-center">
                    <Maximize className="h-6 w-6 mx-auto mb-2 text-holy-600" />
                    <p className="font-semibold">{formatArea(property.area)}</p>
                    <p className="text-sm text-gray-500">Carpet Area</p>
                  </div>
                  <div className="text-center">
                    <Home className="h-6 w-6 mx-auto mb-2 text-holy-600" />
                    <p className="font-semibold capitalize">{property.furnished}</p>
                    <p className="text-sm text-gray-500">Furnishing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About this Property</h2>
                <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-holy-600" />
                        <span className="text-gray-600">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Property Type</p>
                    <p className="font-medium capitalize">{property.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Possession Status</p>
                    <p className="font-medium capitalize">
                      {property.possession === 'ready' ? 'Ready to Move' : 'Under Construction'}
                    </p>
                  </div>
                  {property.floor !== undefined && (
                    <div>
                      <p className="text-gray-500 text-sm">Floor</p>
                      <p className="font-medium">{property.floor} of {property.totalFloors}</p>
                    </div>
                  )}
                  {property.parking !== undefined && (
                    <div>
                      <p className="text-gray-500 text-sm">Parking</p>
                      <p className="font-medium">{property.parking} {property.parking === 1 ? 'Space' : 'Spaces'}</p>
                    </div>
                  )}
                  {property.age && (
                    <div>
                      <p className="text-gray-500 text-sm">Property Age</p>
                      <p className="font-medium">{property.age}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500 text-sm">Listed On</p>
                    <p className="font-medium">{formatDate(property.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-holy-100 flex items-center justify-center">
                    <span className="text-holy-700 font-semibold text-lg">
                      {property.owner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{property.owner.name}</p>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>
                </div>

                {showContactForm ? (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Enter your message..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
                      rows={4}
                      required
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="flex-1"
                      >
                        Send
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowContactForm(true)}
                      className="w-full"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </Button>
                    <a
                      href={`tel:${property.owner.phone}`}
                      className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {property.owner.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* EMI Calculator Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">EMI Calculator</h3>
                <EMICalculator price={property.price} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// EMI Calculator Component
function EMICalculator({ price }: { price: number }) {
  const [loanAmount, setLoanAmount] = useState(Math.round(price * 0.8));
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const monthlyRate = interestRate / (12 * 100);
  const months = tenure * 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
  const totalAmount = emi * months;
  const totalInterest = totalAmount - loanAmount;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-500">Loan Amount</label>
        <input
          type="range"
          min={100000}
          max={price}
          step={100000}
          value={loanAmount}
          onChange={(e) => setLoanAmount(parseInt(e.target.value))}
          className="w-full mt-1"
        />
        <p className="font-semibold">₹{loanAmount.toLocaleString('en-IN')}</p>
      </div>

      <div>
        <label className="text-sm text-gray-500">Interest Rate (%)</label>
        <input
          type="range"
          min={5}
          max={15}
          step={0.1}
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          className="w-full mt-1"
        />
        <p className="font-semibold">{interestRate}%</p>
      </div>

      <div>
        <label className="text-sm text-gray-500">Loan Tenure (Years)</label>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={tenure}
          onChange={(e) => setTenure(parseInt(e.target.value))}
          className="w-full mt-1"
        />
        <p className="font-semibold">{tenure} Years</p>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Monthly EMI</span>
          <span className="font-bold text-holy-600">₹{emi.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Total Interest</span>
          <span>₹{totalInterest.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Total Amount</span>
          <span>₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
