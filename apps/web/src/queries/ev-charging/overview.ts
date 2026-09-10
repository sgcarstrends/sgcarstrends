import { districtForPostalCode } from "@web/config/postal-districts";
import { cacheLife } from "next/cache";
import {
  type EvChargingLiveSummary,
  getEvChargingLiveSummary,
} from "./live-summary";
import {
  type EvChargingNetworkSummary,
  getEvChargingNetworkSummary,
} from "./network-summary";
import {
  type EvChargingPricedLocation,
  getEvChargingPriceRankings,
  type PriceOrder,
} from "./price-rankings";

export interface EvChargingRateStat {
  /** Advertised $/kWh at the leading location. */
  pricePerKwh: number;
  /** Where it is charged, or how many locations share the rate. */
  description: string | null;
}

export interface EvChargingOverview {
  live: EvChargingLiveSummary;
  network: EvChargingNetworkSummary;
  /** DC per-kWh extremes; `null` when no DC rate is advertised. */
  cheapestDc: EvChargingRateStat | null;
  priciestDc: EvChargingRateStat | null;
}

/**
 * Where a rate is charged: the operator and district when one location has
 * it, otherwise how many share it.
 */
function describeRate(locations: EvChargingPricedLocation[]): string | null {
  const leader = locations[0];
  if (!leader) {
    return null;
  }

  const atRate = locations.filter(
    (location) => location.pricePerKwh === leader.pricePerKwh,
  );
  if (atRate.length > 1) {
    return `${atRate.length} locations at this rate`;
  }

  return [leader.operator, districtForPostalCode(leader.postalCode)?.name]
    .filter(Boolean)
    .join(" · ");
}

async function rateStat(order: PriceOrder): Promise<EvChargingRateStat | null> {
  const locations = await getEvChargingPriceRankings({
    limit: Number.MAX_SAFE_INTEGER,
    order,
    powerRating: "DC",
  });
  const leader = locations[0];
  if (!leader) {
    return null;
  }

  return {
    pricePerKwh: leader.pricePerKwh,
    description: describeRate(locations),
  };
}

/**
 * The handful of figures the homepage shows for public charging, reduced
 * from the full connector snapshot and cached as their own small entry.
 *
 * The homepage renders per request, and the snapshot behind these numbers is
 * every connector in Singapore, several megabytes in the Data Cache. Reading
 * it into the function on every visit was the bulk of the site's origin
 * transfer, so the reduction happens once per cache life here and the page
 * reads a few hundred bytes instead.
 */
export async function getEvChargingOverview(): Promise<EvChargingOverview> {
  "use cache: remote";
  cacheLife("hours");

  const [live, network, cheapestDc, priciestDc] = await Promise.all([
    getEvChargingLiveSummary(),
    getEvChargingNetworkSummary(),
    rateStat("cheapest"),
    rateStat("priciest"),
  ]);

  return { live, network, cheapestDc, priciestDc };
}
