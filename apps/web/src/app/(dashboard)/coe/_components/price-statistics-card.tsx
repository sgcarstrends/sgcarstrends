import { Card, CardBody, CardHeader } from "@heroui/card";
import Typography from "@web/components/typography";
import type { TrendInsight } from "@web/lib/coe/calculations";
import { BarChart3Icon } from "lucide-react";

interface PriceStatisticsCardProps {
  trendInsights: TrendInsight[];
}

export const PriceStatisticsCard = ({
  trendInsights,
}: PriceStatisticsCardProps) => {
  if (trendInsights.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <BarChart3Icon className="size-5 text-default-500" />
          <h3 className="font-medium text-foreground text-lg">
            Price Statistics
          </h3>
        </div>
        <p className="text-default-500 text-xs">Historical ranges</p>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="flex flex-col gap-3">
          {trendInsights.map((insight) => (
            <div key={insight.category} className="flex flex-col gap-1">
              <Typography.TextSm className="font-medium">
                {insight.category}
              </Typography.TextSm>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col">
                  <span className="text-default-400">Avg</span>
                  <span className="font-medium tabular-nums">
                    ${Math.round(insight.average).toLocaleString()}
                  </span>
                </div>
                {/* For COE: high price = bad (danger/red), low price = good (success/green) */}
                <div className="flex flex-col">
                  <span className="text-default-400">High</span>
                  <span className="font-medium text-danger tabular-nums">
                    ${insight.highest.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-default-400">Low</span>
                  <span className="font-medium text-success tabular-nums">
                    ${insight.lowest.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
