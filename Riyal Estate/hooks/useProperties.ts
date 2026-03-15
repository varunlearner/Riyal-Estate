'use client';

import useSWR from 'swr';
import { IProperty, ISearchFilters } from '@/types';

interface PropertiesResponse {
  data: IProperty[];
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};

export function useProperties(
  filters: ISearchFilters = {},
  page: number = 1,
  limit: number = 12
) {
  const queryParams = new URLSearchParams();
  
  if (filters.city) queryParams.set('city', filters.city);
  if (filters.locality) queryParams.set('locality', filters.locality);
  if (filters.listingType && filters.listingType !== 'all') {
    queryParams.set('listingType', filters.listingType);
  }
  if (filters.propertyType?.length) {
    queryParams.set('propertyType', filters.propertyType.join(','));
  }
  if (filters.minPrice) queryParams.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
  if (filters.minArea) queryParams.set('minArea', filters.minArea.toString());
  if (filters.maxArea) queryParams.set('maxArea', filters.maxArea.toString());
  if (filters.bedrooms?.length) {
    queryParams.set('bedrooms', filters.bedrooms.join(','));
  }
  if (filters.bathrooms?.length) {
    queryParams.set('bathrooms', filters.bathrooms.join(','));
  }
  if (filters.furnished?.length) {
    queryParams.set('furnished', filters.furnished.join(','));
  }
  if (filters.possession?.length) {
    queryParams.set('possession', filters.possession.join(','));
  }
  if (filters.amenities?.length) {
    queryParams.set('amenities', filters.amenities.join(','));
  }
  
  queryParams.set('page', page.toString());
  queryParams.set('limit', limit.toString());

  const { data, error, isLoading, mutate } = useSWR<PropertiesResponse>(
    `/api/properties?${queryParams.toString()}`,
    fetcher
  );

  return {
    properties: data?.data || [],
    count: data?.count || 0,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProperty(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ data: IProperty }>(
    id ? `/api/properties/${id}` : null,
    fetcher
  );

  return {
    property: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useFeaturedProperties(limit: number = 8) {
  const { data, error, isLoading } = useSWR<{ data: IProperty[] }>(
    `/api/properties/featured?limit=${limit}`,
    fetcher
  );

  return {
    properties: data?.data || [],
    isLoading,
    isError: error,
  };
}

export function useUserProperties(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<{ data: IProperty[] }>(
    userId ? `/api/properties/user/${userId}` : null,
    fetcher
  );

  return {
    properties: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useSavedProperties() {
  const { data, error, isLoading, mutate } = useSWR<{ data: IProperty[] }>(
    '/api/users/saved-properties',
    fetcher
  );

  return {
    savedProperties: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
