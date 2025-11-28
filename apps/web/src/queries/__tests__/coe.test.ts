import { describe, expect, it } from "vitest";
import { getCoeMonths } from "../coe/available-months";
import {
  getCoeResults,
  getCoeResultsByPeriod,
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

  it("should return the available COE months", async () => {
    queueSelectDistinct([{ month: "2024-05" }, { month: "2024-04" }]);

    const result = await getCoeMonths();

    expect(result).toEqual([{ month: "2024-05" }, { month: "2024-04" }]);
    expect(cacheLifeMock).toHaveBeenCalledWith("max");
    expect(cacheTagMock).toHaveBeenCalledWith("coe:months");
  });

  it("should return the latest COE bidding results", async () => {
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
    expect(cacheTagMock).toHaveBeenCalledWith("coe:latest");
  });

  it("should return an empty list when no latest month is available", async () => {
    queueSelect([{ latestMonth: null }]);

    const result = await getLatestCoeResults();

    expect(result).toEqual([]);
  });

  it("should load all COE results without filters", async () => {
    queueSelect([{ id: 1 }]);

    const result = await getCoeResults();

    expect(result).toEqual([{ id: 1 }]);
    expect(cacheTagMock).toHaveBeenCalledWith("coe:results");
  });

  it("should return COE results by period with correct cache tag", async () => {
    // First call: selectDistinct for months
    queueSelectDistinct([{ month: "2024-05" }, { month: "2024-01" }]);
    // Second call: select for filtered results
    queueSelect([{ id: 2 }]);

    const result = await getCoeResultsByPeriod("12m");

    expect(result).toEqual([{ id: 2 }]);
    expect(cacheTagMock).toHaveBeenCalledWith("coe:period:12m");
  });

  it("should return empty array when no months available", async () => {
    queueSelectDistinct([]);

    const result = await getCoeResultsByPeriod("12m");

    expect(result).toEqual([]);
  });

  it("should use default period of 12m when not specified", async () => {
    queueSelectDistinct([{ month: "2024-05" }, { month: "2024-01" }]);
    queueSelect([{ id: 3 }]);

    await getCoeResultsByPeriod();

    expect(cacheTagMock).toHaveBeenCalledWith("coe:period:12m");
  });
});
