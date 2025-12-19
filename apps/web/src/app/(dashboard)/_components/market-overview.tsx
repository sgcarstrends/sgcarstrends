import { Chip } from "@heroui/chip";
import Typography from "@web/components/typography";
import { getCategorySummaryByYear } from "@web/queries/cars";

export async function MarketOverview() {
  const summary = await getCategorySummaryByYear();

  return (
    <div className="col-span-12 rounded-3xl border border-default-200 bg-white p-6 lg:col-span-8">
      <div className="mb-4 flex items-center justify-between">
        <Typography.H3>Market Overview</Typography.H3>
        <Chip color="primary" size="sm">
          {summary.year}
        </Chip>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-default-100 p-4">
          <p className="text-default-500 text-sm">Total Cars</p>
          <p className="mt-1 font-bold text-2xl text-primary tabular-nums">
            {summary.total.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl bg-default-100 p-4">
          <p className="text-default-500 text-sm">Electric</p>
          <p className="mt-1 font-bold text-2xl text-primary tabular-nums">
            {summary.electric.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl bg-default-100 p-4">
          <p className="text-default-500 text-sm">Hybrid</p>
          <p className="mt-1 font-bold text-2xl text-primary tabular-nums">
            {summary.hybrid.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
