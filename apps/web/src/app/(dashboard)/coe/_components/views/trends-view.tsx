import { Card, CardBody, CardHeader } from "@heroui/card";
import { COEPremiumChart } from "@web/app/(dashboard)/coe/_components/premium-chart";
import Typography from "@web/components/typography";
import type { TrendInsight } from "@web/lib/coe/calculations";
import type { COEBiddingResult } from "@web/types";

interface TrendsViewProps {
  data: COEBiddingResult[];
  trendInsights: TrendInsight[];
}

export const TrendsView = ({ data, trendInsights }: TrendsViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <COEPremiumChart data={data} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col items-start gap-2">
            <h3 className="font-medium text-foreground text-xl">
              Market Trends
            </h3>
            <p className="text-default-600 text-sm">
              Latest price movements and trends
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              {trendInsights.map((insight) => (
                <div
                  key={insight?.category}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <Typography.Text>{insight?.category}</Typography.Text>
                    <Typography.TextSm>
                      Latest: ${insight?.latest.toLocaleString()}
                    </Typography.TextSm>
                  </div>
                  <div className="text-right">
                    <Typography.Text
                      className={`font-medium ${
                        (insight?.change || 0) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(insight?.change || 0) >= 0 ? "+" : ""}
                      {insight?.change.toFixed(1)}%
                    </Typography.Text>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-col items-start gap-2">
            <h3 className="font-medium text-foreground text-xl">
              Price Statistics
            </h3>
            <p className="text-default-600 text-sm">
              Historical price ranges and averages
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              {trendInsights.map((insight) => (
                <div key={insight?.category} className="border-b pb-2">
                  <Typography.Text>{insight?.category}</Typography.Text>
                  <div className="flex flex-col gap-2">
                    <Typography.TextSm>
                      <span>Average:</span>
                      <span>${insight?.average.toLocaleString()}</span>
                    </Typography.TextSm>
                    <Typography.TextSm>
                      <span>Highest:</span>
                      <span>${insight?.highest.toLocaleString()}</span>
                    </Typography.TextSm>
                    <Typography.TextSm>
                      <span>Lowest:</span>
                      <span>${insight?.lowest.toLocaleString()}</span>
                    </Typography.TextSm>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
