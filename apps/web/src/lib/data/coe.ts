"use server";

import { API_URL } from "@web/config";
import type { COEResult } from "@web/types";
import { RevalidateTags } from "@web/types";
import type { Pqp } from "@web/types/coe";
import { CACHE_DURATION, fetchApi } from "@web/utils/fetch-api";

export interface COEMarketShareData {
  category: string;
  premium: number;
  percentage: number;
  quota: number;
  colour: string;
}

export const getCOEResults = async (): Promise<COEResult[]> => {
  return fetchApi<COEResult[]>(`${API_URL}/coe`, {
    next: {
      tags: [RevalidateTags.COE],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getLatestCOEResults = async (): Promise<COEResult[]> => {
  return fetchApi<COEResult[]>(`${API_URL}/coe/latest`, {
    next: {
      tags: [RevalidateTags.COE, RevalidateTags.Latest],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getPQPData = async (): Promise<Record<string, Pqp.Rates>> => {
  return fetchApi<Record<string, Pqp.Rates>>(`${API_URL}/coe/pqp`, {
    next: {
      tags: [RevalidateTags.COE, "pqp"],
      revalidate: CACHE_DURATION,
    },
  });
};
