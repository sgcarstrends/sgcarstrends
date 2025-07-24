import 'server-only';

import { cache } from 'react';
import { API_URL } from '@/config';
import { fetchApi } from './fetch-api';
import { RevalidateTags } from '@/types';
import type { 
  Registration, 
  Comparison, 
  TopMake, 
  TopType, 
  FuelType 
} from '@/types/cars';
import type { COEResult, PQP } from '@/types';

/**
 * Cached car registration data fetcher
 * Prevents duplicate API calls for the same month within a single render
 */
export const getCarsData = cache(async (month: string): Promise<Registration> => {
  return fetchApi<Registration>(`${API_URL}/cars?month=${month}`, {
    next: { 
      tags: [RevalidateTags.Cars, `${RevalidateTags.Cars}:${month}`],
      revalidate: 3600 // 1 hour
    }
  });
});

/**
 * Cached car comparison data fetcher
 */
export const getCarsComparison = cache(async (month: string): Promise<Comparison> => {
  return fetchApi<Comparison>(`${API_URL}/cars/compare?month=${month}`, {
    next: { 
      tags: [RevalidateTags.Analysis, RevalidateTags.Comparison, RevalidateTags.Cars],
      revalidate: 1800 // 30 minutes
    }
  });
});

/**
 * Cached top vehicle types data fetcher
 */
export const getTopTypes = cache(async (month: string): Promise<TopType> => {
  return fetchApi<TopType>(`${API_URL}/cars/top-types?month=${month}`, {
    next: { 
      tags: [RevalidateTags.Analysis, RevalidateTags.TopPerformers, RevalidateTags.Cars],
      revalidate: 1800 // 30 minutes
    }
  });
});

/**
 * Cached top makes data fetcher
 */
export const getTopMakes = cache(async (month: string): Promise<FuelType[]> => {
  return fetchApi<FuelType[]>(`${API_URL}/cars/top-makes?month=${month}`, {
    next: { 
      tags: [RevalidateTags.Analysis, RevalidateTags.TopPerformers, RevalidateTags.Cars],
      revalidate: 1800 // 30 minutes
    }
  });
});

/**
 * Cached COE results data fetcher
 */
export const getCOEResults = cache(async (): Promise<COEResult[]> => {
  return fetchApi<COEResult[]>(`${API_URL}/coe`, {
    next: { 
      tags: [RevalidateTags.COE],
      revalidate: 3600 // 1 hour
    }
  });
});

/**
 * Cached latest COE results data fetcher
 */
export const getLatestCOEResults = cache(async (): Promise<COEResult[]> => {
  return fetchApi<COEResult[]>(`${API_URL}/coe/latest`, {
    next: { 
      tags: [RevalidateTags.COE, RevalidateTags.Latest],
      revalidate: 900 // 15 minutes
    }
  });
});

/**
 * Cached COE results by period fetcher
 */
export const getCOEResultsByPeriod = cache(async (period?: string): Promise<COEResult[]> => {
  const url = period ? `${API_URL}/coe?period=${period}` : `${API_URL}/coe`;
  return fetchApi<COEResult[]>(url, {
    next: { 
      tags: [RevalidateTags.COE, ...(period ? [`${RevalidateTags.COE}:${period}`] : [])],
      revalidate: 3600 // 1 hour
    }
  });
});

/**
 * Cached PQP (Prevailing Quota Premium) data fetcher
 */
export const getPQPData = cache(async (): Promise<Record<string, PQP>> => {
  return fetchApi<Record<string, PQP>>(`${API_URL}/coe/pqp`, {
    next: { 
      tags: [RevalidateTags.COE, 'pqp'],
      revalidate: 3600 // 1 hour
    }
  });
});

/**
 * Cached latest month data fetcher
 */
export const getLatestMonth = cache(async (type: 'cars' | 'coe'): Promise<{ month: string }> => {
  return fetchApi<{ month: string }>(`${API_URL}/${type}/months/latest`, {
    next: { 
      tags: [RevalidateTags.Latest, RevalidateTags.Reference, type],
      revalidate: 900 // 15 minutes
    }
  });
});

/**
 * Cached months list fetcher
 */
export const getMonthsList = cache(async (type: 'cars' | 'coe'): Promise<string[]> => {
  return fetchApi<string[]>(`${API_URL}/${type}/months`, {
    next: { 
      tags: [RevalidateTags.Reference, type],
      revalidate: 86400 // 24 hours
    }
  });
});

/**
 * Cached makes list fetcher
 */
export const getMakesList = cache(async (): Promise<string[]> => {
  return fetchApi<string[]>(`${API_URL}/cars/makes`, {
    next: { 
      tags: [RevalidateTags.Reference, RevalidateTags.Cars],
      revalidate: 86400 // 24 hours
    }
  });
});

/**
 * Generic cached API fetcher for custom endpoints
 */
export const getCachedData = cache(async <T>(
  endpoint: string, 
  tags: string[] = [],
  revalidate: number = 3600
): Promise<T> => {
  return fetchApi<T>(`${API_URL}${endpoint}`, {
    next: { tags, revalidate }
  });
});