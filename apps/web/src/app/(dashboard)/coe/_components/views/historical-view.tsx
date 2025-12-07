import { Card, CardBody, CardHeader } from "@heroui/card";
import { COEPremiumChart } from "@web/app/(dashboard)/coe/_components/premium-chart";
import { TrendTable } from "@web/components/tables/coe-results-table";
import type { COEBiddingResult, COEResult } from "@web/types";

interface HistoricalViewProps {
  data: COEBiddingResult[];
  coeResults: COEResult[];
}

export const HistoricalView = ({ data, coeResults }: HistoricalViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <COEPremiumChart data={data} />

      <Card>
        <CardHeader className="flex flex-col items-start gap-2">
          <h3 className="font-medium text-foreground text-xl">
            Historical Data
          </h3>
          <p className="text-default-600 text-sm">
            Complete list of historical COE prices
          </p>
        </CardHeader>
        <CardBody>
          <TrendTable coeResults={coeResults} />
        </CardBody>
      </Card>
    </div>
  );
};
