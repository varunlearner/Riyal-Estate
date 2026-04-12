import { useEffect, useState } from 'react';
import { IProperty } from '@/types';

interface UseNearbyPropertiesOptions {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  limit?: number;
}

interface NearbyProperty extends IProperty {
  distance: number; // Distance in kilometers
}

export function useNearbyProperties(options: UseNearbyPropertiesOptions) {
  const [properties, setProperties] = useState<NearbyProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options.latitude === 0 && options.longitude === 0) {
      setError('Valid coordinates are required');
      return;
    }

    const fetchNearbyProperties = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          lat: options.latitude.toString(),
          lng: options.longitude.toString(),
          radius: (options.radiusKm || 5).toString(),
          limit: (options.limit || 20).toString(),
        });

        const response = await fetch(`/api/properties/nearby?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch nearby properties');
        }

        const data = await response.json();
        setProperties(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyProperties();
  }, [options.latitude, options.longitude, options.radiusKm, options.limit]);

  return { properties, isLoading, error };
}
