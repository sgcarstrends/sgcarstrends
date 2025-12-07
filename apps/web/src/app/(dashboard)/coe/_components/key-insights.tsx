import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Typography from "@web/components/typography";
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
      <CardBody className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-default-500">
            <TrendingUpIcon className="size-4" />
            <span className="font-medium text-sm">Key Insights</span>
          </div>
          <div className="h-4 w-px bg-divider" />
          <div className="flex flex-wrap items-center gap-2">
            {insights.map((insight, index) => (
              <Chip
                key={`${insight.type}-${insight.category}-${index}`}
                size="sm"
                color={getInsightColor(insight)}
                variant="flat"
                startContent={getInsightIcon(insight)}
                classNames={{
                  base: "h-auto py-1.5 px-2.5",
                  content: "text-xs font-medium",
                }}
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
