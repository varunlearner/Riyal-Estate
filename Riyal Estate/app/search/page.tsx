'use client';

import PropertyCard from '@/components/property/PropertyCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProperties } from '@/hooks/useProperties';
import { BEDROOM_OPTIONS, FURNISHED_OPTIONS, INDIAN_CITIES, ISearchFilters, POSSESSION_OPTIONS, PROPERTY_TYPES } from '@/types';
import { Filter, Grid, List, MapPin, Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  // Parse filters from URL
  const [filters, setFilters] = useState<ISearchFilters>({
    city: searchParams.get('city') || '',
    locality: searchParams.get('locality') || '',
    listingType: (searchParams.get('listingType') as 'sale' | 'rent' | 'all') || 'all',
    propertyType: searchParams.get('propertyType')?.split(',') || [],
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    minArea: searchParams.get('minArea') ? parseInt(searchParams.get('minArea')!) : undefined,
    maxArea: searchParams.get('maxArea') ? parseInt(searchParams.get('maxArea')!) : undefined,
    bedrooms: searchParams.get('bedrooms')?.split(',').map(b => parseInt(b)) || [],
    furnished: searchParams.get('furnished')?.split(',') || [],
    possession: searchParams.get('possession')?.split(',') || [],
    amenities: searchParams.get('amenities')?.split(',') || [],
  });

  const { properties, count, pagination, isLoading } = useProperties(filters, page, 12);

  const updateFilters = (newFilters: Partial<ISearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    setPage(1);

    // Update URL
    const params = new URLSearchParams();
    if (updated.city) params.set('city', updated.city);
    if (updated.locality) params.set('locality', updated.locality);
    if (updated.listingType && updated.listingType !== 'all') params.set('listingType', updated.listingType);
    if (updated.propertyType?.length) params.set('propertyType', updated.propertyType.join(','));
    if (updated.bedrooms?.length) params.set('bedrooms', updated.bedrooms.join(','));
    if (updated.furnished?.length) params.set('furnished', updated.furnished.join(','));
    if (updated.possession?.length) params.set('possession', updated.possession.join(','));

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      listingType: 'all',
    });
    setPage(1);
    router.push('/search');
  };

  const activeFiltersCount = Object.values(filters).filter(v =>
    v && (Array.isArray(v) ? v.length > 0 : v !== 'all')
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by locality, project, or landmark..."
                value={filters.locality || ''}
                onChange={(e) => updateFilters({ locality: e.target.value })}
                className="pl-12 py-3 h-auto"
              />
            </div>

            {/* City Select */}
            <div className="w-full md:w-48">
              <select
                value={filters.city || ''}
                onChange={(e) => updateFilters({ city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-holy-500 focus:border-transparent outline-none"
              >
                <option value="">All Cities</option>
                {INDIAN_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Listing Type */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => updateFilters({ listingType: 'all' })}
                className={`px-4 py-3 text-sm font-medium ${filters.listingType === 'all'
                    ? 'bg-holy-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => updateFilters({ listingType: 'sale' })}
                className={`px-4 py-3 text-sm font-medium border-l ${filters.listingType === 'sale'
                    ? 'bg-holy-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Buy
              </button>
              <button
                onClick={() => updateFilters({ listingType: 'rent' })}
                className={`px-4 py-3 text-sm font-medium border-l ${filters.listingType === 'rent'
                    ? 'bg-holy-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Rent
              </button>
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-holy-600 text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-64 space-y-6">
              {/* Property Type */}
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-semibold mb-3">Property Type</h3>
                <div className="space-y-2">
                  {PROPERTY_TYPES.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.propertyType?.includes(type.value)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(filters.propertyType || []), type.value]
                            : (filters.propertyType || []).filter(t => t !== type.value);
                          updateFilters({ propertyType: updated });
                        }}
                        className="rounded border-gray-300 text-holy-600 focus:ring-holy-500"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-semibold mb-3">Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const updated = filters.bedrooms?.includes(option.value)
                          ? filters.bedrooms.filter(b => b !== option.value)
                          : [...(filters.bedrooms || []), option.value];
                        updateFilters({ bedrooms: updated });
                      }}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${filters.bedrooms?.includes(option.value)
                          ? 'bg-holy-600 text-white border-holy-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-holy-500'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilters({ minPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice || ''}
                    onChange={(e) => updateFilters({ maxPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                  />
                </div>
              </div>

              {/* Furnished */}
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-semibold mb-3">Furnished</h3>
                <div className="space-y-2">
                  {FURNISHED_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.furnished?.includes(option.value)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(filters.furnished || []), option.value]
                            : (filters.furnished || []).filter(f => f !== option.value);
                          updateFilters({ furnished: updated });
                        }}
                        className="rounded border-gray-300 text-holy-600 focus:ring-holy-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Possession */}
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-semibold mb-3">Possession</h3>
                <div className="space-y-2">
                  {POSSESSION_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.possession?.includes(option.value)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(filters.possession || []), option.value]
                            : (filters.possession || []).filter(p => p !== option.value);
                          updateFilters({ possession: updated });
                        }}
                        className="rounded border-gray-300 text-holy-600 focus:ring-holy-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold">
                  {isLoading ? 'Loading...' : `${count} Properties Found`}
                </h1>
                {filters.city && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {filters.city}
                    {filters.locality && `, ${filters.locality}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-holy-100 text-holy-600' : 'text-gray-400'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-holy-100 text-holy-600' : 'text-gray-400'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
                }`}>
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
