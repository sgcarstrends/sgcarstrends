import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import type { KeyInsight } from "@web/lib/coe/calculations";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FlameIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react";

interface KeyInsightsProps {
  insights: KeyInsight[];
}

const getInsightIcon = (insight: KeyInsight) => {
  switch (insight.type) {
    case "mover":
      return insight.direction === "up" ? (
        <ArrowUpIcon className="size-4" />
      ) : (
        <ArrowDownIcon className="size-4" />
      );
    case "record":
      return <TrophyIcon className="size-4" />;
    case "demand":
      return <FlameIcon className="size-4" />;
    default:
      return <TrendingUpIcon className="size-4" />;
  }
};

const getInsightColor = (insight: KeyInsight) => {
  switch (insight.type) {
    case "mover":
      // For COE: price up = bad (danger/red), price down = good (success/green)
      return insight.direction === "up" ? "danger" : "success";
    case "record":
      return "warning";
    case "demand":
      return "secondary";
    default:
      return "primary";
  }
};

export const KeyInsights = ({ insights }: KeyInsightsProps) => {
  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardBody>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUpIcon className="size-4" />
            <span className="font-semibold">Key Insights</span>
          </div>
          <div className="h-6 w-px bg-divider" />
          <div className="flex flex-wrap items-center gap-4">
            {insights.map((insight, index) => (
              <Chip
                key={`${insight.type}-${insight.category}-${index}`}
                color={getInsightColor(insight)}
                startContent={getInsightIcon(insight)}
              >
                {insight.message}
              </Chip>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
