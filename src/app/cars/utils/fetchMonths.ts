import { API_URL } from "@/config";
import { type LatestMonth, type Month, RevalidateTags } from "@/types";
import { fetchApi } from "@/utils/fetch-api";

export const fetchMonths = async () =>
  Promise.all([
    await fetchApi<Month[]>(`${API_URL}/cars/months`, {
      next: { tags: [RevalidateTags.Cars] },
    }),
    await fetchApi<LatestMonth>(`${API_URL}/months/latest`, {
      next: { tags: [RevalidateTags.Cars] },
    }),
  ]);
