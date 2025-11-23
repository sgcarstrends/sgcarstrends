import { CACHE_TAG } from "@web/lib/cache";
import { describe, expect, it } from "vitest";
import { getCoeMonths } from "../coe/available-months";
import {
  getCoeResults,
  getCoeResultsFiltered,
} from "../coe/historical-results";
import { getLatestCoeResults } from "../coe/latest-results";
import {
  cacheLifeMock,
  cacheTagMock,
  queueSelect,
  queueSelectDistinct,
  resetDbMocks,
} from "./test-utils";

describe("COE queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  it("returns the available COE months", async () => {
    queueSelectDistinct([{ month: "2024-05" }, { month: "2024-04" }]);

    const result = await getCoeMonths();

    expect(result).toEqual([{ month: "2024-05" }, { month: "2024-04" }]);
    expect(cacheLifeMock).toHaveBeenCalledWith("max");
    expect(cacheTagMock).toHaveBeenCalledWith(CACHE_TAG.COE);
  });

  it("returns the latest COE bidding results", async () => {
    queueSelect(
      [{ latestMonth: "2024-05" }],
      [
        {
          month: "2024-05",
          biddingNo: 2,
          vehicleClass: "A",
        },
      ],
      [{ biddingNo: 2 }],
    );

    const result = await getLatestCoeResults();

    expect(result).toEqual([
      {
        month: "2024-05",
        biddingNo: 2,
        vehicleClass: "A",
      },
    ]);
    expect(cacheTagMock).toHaveBeenCalledWith(CACHE_TAG.COE);
  });

  it("returns an empty list when no latest month is available", async () => {
    queueSelect([{ latestMonth: null }]);

    const result = await getLatestCoeResults();

    expect(result).toEqual([]);
  });

  it("loads all COE results without filters", async () => {
    queueSelect([{ id: 1 }]);

    const result = await getCoeResults();

    expect(result).toEqual([{ id: 1 }]);
    expect(cacheTagMock).toHaveBeenCalledWith(CACHE_TAG.COE);
  });

  it("filters COE results by month", async () => {
    queueSelect([{ id: 2 }]);

    const result = await getCoeResultsFiltered("2024-04");

    expect(result).toEqual([{ id: 2 }]);
    expect(cacheTagMock).toHaveBeenCalledWith(CACHE_TAG.COE);
  });

  it("filters COE results by range", async () => {
    queueSelect([{ id: 3 }]);

    const result = await getCoeResultsFiltered(undefined, "2024-01", "2024-03");

    expect(result).toEqual([{ id: 3 }]);
    expect(cacheTagMock).toHaveBeenCalledWith(CACHE_TAG.COE);
  });

  it("falls back to all-cache tag when no filters are provided", async () => {
    queueSelect([{ id: 4 }]);

    const result = await getCoeResultsFiltered();

    expect(result).toEqual([{ id: 4 }]);
    expect(cacheTagMock).toHaveBeenCalledWith(CACHE_TAG.COE);
  });
});
