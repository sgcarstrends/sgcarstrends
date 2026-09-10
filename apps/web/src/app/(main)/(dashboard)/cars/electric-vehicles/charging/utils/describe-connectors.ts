import type { EvChargingLocation } from "@web/queries/ev-charging";

/** "2× DC 120 kW" style summary of what a location offers. */
export const describeConnectors = (location: EvChargingLocation): string => {
  const rating = location.dcConnectors > 0 ? "DC" : "AC";
  const speed = location.maxSpeedKw != null ? ` ${location.maxSpeedKw} kW` : "";
  return `${location.connectors}× ${rating}${speed}`;
};
