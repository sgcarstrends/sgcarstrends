import { Card, CardBody, CardHeader } from "@heroui/card";
import Typography from "@web/components/typography";
import type { TrendInsight } from "@web/lib/coe/calculations";
import { TrendingUpIcon } from "lucide-react";

interface MarketTrendsCardProps {
  trendInsights: TrendInsight[];
}

export const MarketTrendsCard = ({ trendInsights }: MarketTrendsCardProps) => {
  if (trendInsights.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="size-5 text-default-500" />
          <h3 className="font-medium text-foreground text-lg">Market Trends</h3>
        </div>
        <p className="text-default-500 text-xs">Latest price movements</p>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="flex flex-col gap-3">
          {trendInsights.map((insight) => (
            <div
              key={insight.category}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                <Typography.TextSm className="font-medium">
                  {insight.category}
                </Typography.TextSm>
                <Typography.Caption>
                  ${insight.latest.toLocaleString()}
                </Typography.Caption>
              </div>
              {/* For COE: price up = bad (danger/red), price down = good (success/green) */}
              <span
                className={`font-semibold tabular-nums ${
                  insight.change >= 0 ? "text-danger" : "text-success"
                }`}
              >
                {insight.change >= 0 ? "+" : ""}
                {insight.change.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
