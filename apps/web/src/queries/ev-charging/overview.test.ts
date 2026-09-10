vi.mock("./live-summary", () => ({ getEvChargingLiveSummary: vi.fn() }));
vi.mock("./network-summary", () => ({ getEvChargingNetworkSummary: vi.fn() }));
vi.mock("./price-rankings", () => ({ getEvChargingPriceRankings: vi.fn() }));

import { cacheLifeMock } from "../test-utils";
import { getEvChargingLiveSummary } from "./live-summary";
import { getEvChargingNetworkSummary } from "./network-summary";
import { getEvChargingOverview } from "./overview";
import { getEvChargingPriceRankings } from "./price-rankings";

const live = {
  connectors: 100,
  locations: 40,
  available: 60,
  occupied: 30,
  unavailable: 10,
  observedAt: "2026-09-10T00:00:00.000Z",
};
const network = { connectors: 120, sites: 45 };

const location = (overrides: Record<string, unknown>) => ({
  locationId: "L1",
  stationName: "Station",
  address: null,
  postalCode: "018956",
  operator: "SP",
  connectors: 2,
  pricePerKwh: 0.5,
  speedKw: 50,
  ...overrides,
});

describe("getEvChargingOverview", () => {
  beforeEach(() => {
    vi.mocked(getEvChargingLiveSummary).mockResolvedValue(live);
    vi.mocked(getEvChargingNetworkSummary).mockResolvedValue(network);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should reduce the rankings to one rate stat each on the hours profile", async () => {
    vi.mocked(getEvChargingPriceRankings)
      .mockResolvedValueOnce([
        location({ pricePerKwh: 0.45, operator: "SP" }),
        location({ locationId: "L2", pricePerKwh: 0.5 }),
      ] as never)
      .mockResolvedValueOnce([
        location({ pricePerKwh: 0.9 }),
        location({ locationId: "L2", pricePerKwh: 0.9 }),
        location({ locationId: "L3", pricePerKwh: 0.9 }),
      ] as never);

    const overview = await getEvChargingOverview();

    expect(overview.live).toEqual(live);
    expect(overview.network).toEqual(network);
    expect(overview.cheapestDc).toEqual({
      pricePerKwh: 0.45,
      description: "SP · Raffles Place / Marina",
    });
    expect(overview.priciestDc).toEqual({
      pricePerKwh: 0.9,
      description: "3 locations at this rate",
    });
    expect(getEvChargingPriceRankings).toHaveBeenCalledWith(
      expect.objectContaining({ order: "cheapest", powerRating: "DC" }),
    );
    expect(getEvChargingPriceRankings).toHaveBeenCalledWith(
      expect.objectContaining({ order: "priciest", powerRating: "DC" }),
    );
    expect(cacheLifeMock).toHaveBeenCalledWith("hours");
  });

  it("should return null rate stats when no DC rate is advertised", async () => {
    vi.mocked(getEvChargingPriceRankings).mockResolvedValue([]);

    const overview = await getEvChargingOverview();

    expect(overview.cheapestDc).toBeNull();
    expect(overview.priciestDc).toBeNull();
  });
});
