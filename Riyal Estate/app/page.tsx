'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, Building2, CheckCircle2, Users, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INDIAN_CITIES, PROPERTY_TYPES } from '@/types';
import PropertyCard from '@/components/property/PropertyCard';
import { useFeaturedProperties } from '@/hooks/useProperties';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [listingType, setListingType] = useState<'buy' | 'rent'>('buy');
  const [selectedCity, setSelectedCity] = useState('noida');

  const { properties: featuredProperties, isLoading } = useFeaturedProperties(6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCity) params.set('city', selectedCity);
    params.set('listingType', listingType);
    router.push(`/search?${params.toString()}`);
  };

  const categories = [
    { icon: '🏠', label: 'Residential', count: '4 Properties' },
    { icon: '🏢', label: 'Commercial', count: '1 Property' },
    { icon: '🌳', label: 'Plots/Land', count: 'Coming Soon' },
    { icon: '👑', label: 'Luxury', count: '3 Properties' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find properties instantly by location, type, or budget with smart filters.',
    },
    {
      icon: CheckCircle2,
      title: 'Verified Listings',
      description: 'Every property is reviewed for accuracy, so you can trust what you see.',
    },
    {
      icon: Users,
      title: 'Direct Contact',
      description: 'Connect with sellers directly — zero middlemen, zero hidden charges.',
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Get price trends and neighborhood data to make smarter decisions.',
    },
  ];

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Noida', 'Gurgaon'];

  const footerLinks = {
    company: [
      { href: '#', label: 'About' },
      { href: '#', label: 'Careers' },
      { href: '#', label: 'Blog' },
      { href: '#', label: 'Press' },
    ],
    properties: [
      { href: '#', label: 'Buy' },
      { href: '#', label: 'Rent' },
      { href: '#', label: 'New Launch' },
      { href: '#', label: 'Commercial' },
    ],
    services: [
      { href: '#', label: 'Sell Property' },
      { href: '#', label: 'Property Valuation' },
      { href: '#', label: 'Get Investors' },
      { href: '#', label: 'Legal Assistance' },
    ],
    support: [
      { href: '#', label: 'Help Center' },
      { href: '#', label: 'Contact Us' },
      { href: '#', label: 'Safety Tips' },
      { href: '#', label: 'Feedback' },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a5f4a] via-[#0f4538] to-[#0a3730] min-h-[700px] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#d4a574] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1a5f4a] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl">
            <div className="mb-6 inline-block">
              <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                ✨ Trusted by 10,000+ Users Worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your
              <br />
              <span className="text-[#d4a574]">Perfect</span>
              <br />
              Property
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl">
              Buy, sell, or rent — connect directly with property owners.
              <br />
              No middlemen, no hidden fees.
            </p>

            <div className="flex gap-12 mb-12 flex-wrap">
              <div>
                <p className="text-4xl font-bold text-[#d4a574]">10K+</p>
                <p className="text-white/70 text-sm">Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#d4a574]">2.4K</p>
                <p className="text-white/70 text-sm">Listings</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#d4a574]">98%</p>
                <p className="text-white/70 text-sm">Verified</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/search" className="btn-primary">
                Start Searching
              </Link>
              <Link href="/add-property" className="btn-secondary">
                + List Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-20 mb-20 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setListingType('buy')}
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  listingType === 'buy'
                    ? 'bg-[#1a5f4a] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏠 Buy
              </button>
              <button
                onClick={() => setListingType('rent')}
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  listingType === 'rent'
                    ? 'bg-[#1a5f4a] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔑 Rent
              </button>
              <button className="px-6 py-3 font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300">
                🚀 New Launch
                <span className="ml-2 bg-[#d4a574] text-white px-2 py-0.5 rounded text-xs font-bold">NEW</span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">LOCATION OR NAME</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5f4a] focus:ring-2 focus:ring-[#1a5f4a]/20 outline-none text-gray-900 font-medium"
                  >
                    {INDIAN_CITIES.slice(0, 25).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-[1.5]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5f4a] focus:ring-2 focus:ring-[#1a5f4a]/20 outline-none text-gray-900 font-medium">
                  <option>Commercial</option>
                  <option>Residential</option>
                  <option>Plot</option>
                  <option>Luxury</option>
                </select>
              </div>

              <div className="flex-[1.5]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">BEDROOMS</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5f4a] focus:ring-2 focus:ring-[#1a5f4a]/20 outline-none text-gray-900 font-medium">
                  <option>Any</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4+</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">MAX PRICE</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5f4a] focus:ring-2 focus:ring-[#1a5f4a]/20 outline-none text-gray-900 font-medium">
                  <option>Any</option>
                  <option>50 Lakh</option>
                  <option>1 Cr</option>
                  <option>2 Cr+</option>
                </select>
              </div>

              <Button type="submit" className="btn-primary md:self-end">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <p className="text-sm font-semibold text-[#1a5f4a] tracking-wide mb-2">— BROWSE</p>
            <h2 className="text-4xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-gray-600 mt-2">Find exactly what you&apos;re looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/search?type=${cat.label}`}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#1a5f4a] hover:shadow-lg hover:scale-105 transition-all duration-300 text-center group"
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1a5f4a] transition-colors">{cat.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <p className="text-sm font-semibold text-[#1a5f4a] tracking-wide mb-2">— FEATURED</p>
              <h2 className="text-4xl font-bold text-gray-900">Recommended Properties</h2>
              <p className="text-gray-600 mt-2">Curated listings handpicked for you</p>
            </div>
            <Link href="/search" className="text-[#1a5f4a] font-semibold hover:text-[#0f4538] flex items-center gap-2 mt-6 md:mt-0">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-[#1a5f4a] to-[#0f4538]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#d4a574] tracking-wide mb-2">— WHY US</p>
            <h2 className="text-4xl font-bold text-white">Why Choose Riyal Estate?</h2>
            <p className="text-white/70 mt-2">Built with users in mind — simple, transparent, and effective</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-full bg-[#d4a574]/20 flex items-center justify-center mb-6 group-hover:bg-[#d4a574]/40 transition-colors">
                  <feature.icon className="h-7 w-7 text-[#d4a574]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-[#1a5f4a] to-[#0f4538] rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your Next Home
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Search across thousands of verified listings across India
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="btn-primary bg-white text-[#1a5f4a] hover:bg-gray-100">
                Search Now
              </Link>
              <Link href="/add-property" className="btn-primary bg-[#d4a574] text-white hover:bg-[#c49063] border-0">
                List Property for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a3730] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#d4a574] flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[#0a3730]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Riyal Estate</h3>
                  <p className="text-xs text-white/60">Premium Property Platform</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Your trusted platform for buying and selling properties directly. Simple, transparent, and user-friendly.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/70 hover:text-[#d4a574] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Properties</h4>
              <ul className="space-y-3">
                {footerLinks.properties.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/70 hover:text-[#d4a574] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/70 hover:text-[#d4a574] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/70 hover:text-[#d4a574] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10">
            <h4 className="text-white font-semibold mb-6">Popular Cities</h4>
            <div className="flex flex-wrap gap-3">
              {cities.map((city) => (
                <Link
                  key={city}
                  href={`/search?city=${city}`}
                  className="px-4 py-2 text-sm bg-white/10 hover:bg-[#d4a574]/20 hover:text-[#d4a574] rounded-full text-white/70 transition-all duration-300"
                >
                  📍 {city}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              © 2026 <span className="text-[#d4a574] font-semibold">Riyal Estate</span>. All rights reserved. — UI Prototype
            </p>
            <div className="text-sm text-white/60">
              Made with ❤️ for real people
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}