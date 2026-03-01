import { Card, CardBody, CardHeader } from "@heroui/card";
import { cn } from "@heroui/theme";
import type { SelectCarCost } from "@sgcarstrends/database";
import { formatCurrency } from "@sgcarstrends/utils";
import Typography from "@web/components/typography";
import { CARD_PADDING, RADIUS } from "@web/config/design-system";

interface CostMetricsProps {
  data: SelectCarCost[];
}

export function CostMetrics({ data }: CostMetricsProps) {
  const totalModels = data.length;

  const quotedModels = data.filter((item) => item.sellingPriceWithCoe > 0);

  const avgSellingPrice =
    quotedModels.length > 0
      ? quotedModels.reduce((sum, item) => sum + item.sellingPriceWithCoe, 0) /
        quotedModels.length
      : 0;

  const cheapest =
    quotedModels.length > 0
      ? quotedModels.reduce((min, item) =>
          item.sellingPriceWithCoe < min.sellingPriceWithCoe ? item : min,
        )
      : null;

  const metrics = [
    {
      title: "Models Tracked",
      value: totalModels.toString(),
      description: "Across all fuel types and VES bands",
    },
    {
      title: "Avg Selling Price (w/ COE)",
      value: formatCurrency(avgSellingPrice),
      description: "Average AD selling price including COE",
    },
    {
      title: "Most Affordable",
      value: cheapest ? `${cheapest.make} ${cheapest.model}` : "-",
      description: cheapest
        ? formatCurrency(cheapest.sellingPriceWithCoe)
        : "No quoted prices available",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className={cn(RADIUS.card, CARD_PADDING.standard)}
        >
          <CardHeader>
            <Typography.H4>{metric.title}</Typography.H4>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <span className="font-bold text-4xl text-primary tabular-nums">
              {metric.value}
            </span>
            <Typography.TextSm className="text-default-500">
              {metric.description}
            </Typography.TextSm>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
