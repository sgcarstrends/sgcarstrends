import { API_URL } from "@/config";
import { type LatestMonth, type Month, RevalidateTags } from "@/types";
import { fetchApi } from "@/utils/fetch-api";

export const fetchMonthsForCars = async (): Promise<Month[]> => {
  return fetchApi<Month[]>(`${API_URL}/cars/months`, {
    next: { tags: [RevalidateTags.Cars] },
  });
};

export const fetchMonthsForCOE = async (): Promise<Month[]> => {
  return fetchApi<Month[]>(`${API_URL}/coe/months`, {
    next: { tags: [RevalidateTags.COE] },
  });
};

export const getLatestMonth = async (
  type: "cars" | "coe" = "cars",
): Promise<string> => {
  const latestMonths = await fetchApi<LatestMonth>(`${API_URL}/months/latest`, {
    next: {
      tags: type === "cars" ? [RevalidateTags.Cars] : [RevalidateTags.COE],
    },
  });
  return type === "cars" ? latestMonths.cars : latestMonths.coe;
};

export const getMonthOrLatest = async (
  month: string | null,
  type: "cars" | "coe" = "cars",
): Promise<string> => {
  if (month) {
    return month;
  }
  return getLatestMonth(type);
};
