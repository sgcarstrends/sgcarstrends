import { MAP_ANCHOR_ID } from "@web/app/(main)/(dashboard)/cars/electric-vehicles/charging/search-params";
import { SurfaceCard } from "@web/components/shared/bento";
import { getEvChargingMapSites } from "@web/queries/ev-charging";
import { ChargingMapView } from "./charging-map-view";

/**
 * Every public charging site on a map, coloured by live availability.
 *
 * Reads no search params: the district filter is applied on the client, so
 * this card prerenders into the static shell with the cached site list and
 * costs nothing per request. Reading the district here would put a 2 MB
 * payload into every visit.
 */
export async function ChargingMap() {
  const sites = await getEvChargingMapSites();
  if (sites.length === 0) {
    return null;
  }

  return (
    <div className="scroll-mt-6" id={MAP_ANCHOR_ID}>
      <SurfaceCard className="gap-4 p-7">
        <ChargingMapView sites={sites} />
      </SurfaceCard>
    </div>
  );
}
