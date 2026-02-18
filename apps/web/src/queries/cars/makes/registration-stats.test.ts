import { beforeEach, describe, expect, it } from "vitest";
import { queueSelect, resetDbMocks } from "../../test-utils";
import { getMakeRegistrationStats } from "./registration-stats";

describe("getMakeRegistrationStats", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  it("should return empty array when latest month query returns empty", async () => {
    queueSelect([]);

    const result = await getMakeRegistrationStats();

    expect(result).toEqual([]);
  });

  it("should return empty array when latest month is null", async () => {
    queueSelect([{ latestMonth: null }]);

    const result = await getMakeRegistrationStats();

    expect(result).toEqual([]);
  });

  it("should return registration stats with YoY change and trend data", async () => {
    queueSelect([{ latestMonth: "2025-01" }]); // latest month
    queueSelect([
      // annual rows for 2025
      { make: "TOYOTA", count: 1000 },
      { make: "HONDA", count: 500 },
    ]);
    queueSelect([
      // rolling 12-month trend rows
      { make: "TOYOTA", month: "2024-02", count: 80 },
      { make: "TOYOTA", month: "2024-03", count: 90 },
      { make: "HONDA", month: "2024-02", count: 40 },
    ]);
    queueSelect([
      // prev year rows
      { make: "TOYOTA", count: 800 },
      { make: "HONDA", count: 600 },
    ]);

    const result = await getMakeRegistrationStats();

    expect(result).toHaveLength(2);

    const toyota = result.find((r) => r.make === "TOYOTA");
    expect(toyota?.count).toBe(1000);
    expect(toyota?.share).toBeCloseTo((1000 / 1500) * 100, 1);
    expect(toyota?.trend).toEqual([{ value: 80 }, { value: 90 }]);
    expect(toyota?.yoyChange).toBeCloseTo(25, 1); // (1000-800)/800 * 100

    const honda = result.find((r) => r.make === "HONDA");
    expect(honda?.yoyChange).toBeCloseTo(-16.67, 1); // (500-600)/600 * 100
  });

  it("should return null yoyChange when make has no previous year data", async () => {
    queueSelect([{ latestMonth: "2025-01" }]);
    queueSelect([{ make: "NEWMAKE", count: 200 }]);
    queueSelect([]);
    queueSelect([]); // no prev year data

    const result = await getMakeRegistrationStats();

    expect(result[0].yoyChange).toBeNull();
  });

  it("should return null yoyChange when previous year count is zero", async () => {
    queueSelect([{ latestMonth: "2025-01" }]);
    queueSelect([{ make: "TOYOTA", count: 500 }]);
    queueSelect([]);
    queueSelect([{ make: "TOYOTA", count: 0 }]);

    const result = await getMakeRegistrationStats();

    expect(result[0].yoyChange).toBeNull();
  });

  it("should return zero share when grandTotal is zero", async () => {
    queueSelect([{ latestMonth: "2025-01" }]);
    queueSelect([{ make: "TOYOTA", count: 0 }]);
    queueSelect([]);
    queueSelect([]);

    const result = await getMakeRegistrationStats();

    expect(result[0].share).toBe(0);
  });

  it("should return empty trend array when make has no rolling monthly data", async () => {
    queueSelect([{ latestMonth: "2025-01" }]);
    queueSelect([{ make: "TOYOTA", count: 100 }]);
    queueSelect([]); // no trend data
    queueSelect([{ make: "TOYOTA", count: 80 }]);

    const result = await getMakeRegistrationStats();

    expect(result[0].trend).toEqual([]);
  });

  it("should accumulate multiple months per make in trend", async () => {
    queueSelect([{ latestMonth: "2025-01" }]);
    queueSelect([
      { make: "TOYOTA", count: 100 },
      { make: "HONDA", count: 50 },
    ]);
    queueSelect([
      { make: "TOYOTA", month: "2024-11", count: 8 },
      { make: "TOYOTA", month: "2024-12", count: 10 }, // same make, second entry
      { make: "HONDA", month: "2024-12", count: 5 }, // new make entry
    ]);
    queueSelect([]);

    const result = await getMakeRegistrationStats();

    const toyota = result.find((r) => r.make === "TOYOTA");
    expect(toyota?.trend).toHaveLength(2);

    const honda = result.find((r) => r.make === "HONDA");
    expect(honda?.trend).toHaveLength(1);
  });
});
