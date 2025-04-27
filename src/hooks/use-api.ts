import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseApiOptions<T> {
  initialData?: T;
  retryCount?: number;
  retryDelay?: number;
  cacheTime?: number;
  enabled?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const cache = new Map<string, { data: any; timestamp: number }>();

export function useApi<T>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const {
    initialData = null,
    retryCount = 3,
    retryDelay = 1000,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      return;
    }

    setIsLoading(true);
    setError(null);

    let attempts = 0;
    while (attempts < retryCount) {
      try {
        const response = await fetch(url, {
          credentials: 'include', // Include credentials in the request
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        
        // Update cache
        cache.set(url, { data: json, timestamp: Date.now() });
        
        setData(json);
        return;
      } catch (err) {
        attempts++;
        if (attempts === retryCount) {
          setError(err as Error);
          toast.error('Failed to fetch data. Please try again later.');
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      } finally {
        if (attempts === retryCount) {
          setIsLoading(false);
        }
      }
    }
  }, [url, retryCount, retryDelay, cacheTime, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
} 