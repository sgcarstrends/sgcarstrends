import { getYearlyRegistrations } from "@web/queries/cars";

export async function MarketOverview() {
  const yearlyData = await getYearlyRegistrations();
  const currentYear = yearlyData.at(-1);

  // TODO: Replace placeholder calculations with real fuel type queries from the database
  // These hardcoded percentages are temporary - actual EV/hybrid data should come from
  // querying cars table grouped by fuelType (e.g., "Electric", "Petrol-Electric", "Diesel-Electric")
  const newCars = currentYear?.total ?? 0;
  const electricVehicles = Math.round(newCars * 0.15); // Placeholder: ~15% EV share
  const hybridVehicles = Math.round(newCars * 0.25); // Placeholder: ~25% hybrid share

  return (
    <div className="col-span-12 rounded-3xl border border-default-200 bg-white p-6 lg:col-span-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Market Overview</h2>
        <span className="rounded-full bg-secondary/20 px-3 py-1 font-medium text-secondary text-xs">
          {currentYear?.year ?? new Date().getFullYear()}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-default-100 p-4">
          <p className="text-default-500 text-sm">Total Cars</p>
          <p className="mt-1 font-bold text-2xl text-primary tabular-nums">
            {newCars.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl bg-default-100 p-4">
          <p className="text-default-500 text-sm">Electric</p>
          <p className="mt-1 font-bold text-2xl text-primary tabular-nums">
            {electricVehicles.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl bg-default-100 p-4">
          <p className="text-default-500 text-sm">Hybrid</p>
          <p className="mt-1 font-bold text-2xl text-primary tabular-nums">
            {hybridVehicles.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
