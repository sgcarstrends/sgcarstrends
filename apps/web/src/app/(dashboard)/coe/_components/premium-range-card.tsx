import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Typography from "@web/components/typography";
import {
  COE_CHART_COLOURS,
  type PremiumRangeStats,
} from "@web/lib/coe/calculations";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";

interface PremiumRangeCardProps {
  stats: PremiumRangeStats[];
}

const CATEGORY_COLOR_MAP: Record<string, string> = {
  "Category A": COE_CHART_COLOURS[0],
  "Category B": COE_CHART_COLOURS[1],
  "Category C": COE_CHART_COLOURS[2],
  "Category D": COE_CHART_COLOURS[3],
  "Category E": COE_CHART_COLOURS[4],
};

const formatCurrency = (value: number) => `S$${value.toLocaleString("en-SG")}`;

interface RangeBarProps {
  lowest: number;
  highest: number;
  globalMin: number;
  globalMax: number;
  accentColor: string;
}

const RangeBar = ({
  lowest,
  highest,
  globalMin,
  globalMax,
  accentColor,
}: RangeBarProps) => {
  const range = globalMax - globalMin;
  const leftPercent = range > 0 ? ((lowest - globalMin) / range) * 100 : 0;
  const widthPercent = range > 0 ? ((highest - lowest) / range) * 100 : 100;

  return (
    <div className="relative h-2 w-full rounded-full bg-default-100">
      <div
        className="absolute h-full rounded-full transition-all duration-500 ease-out"
        style={{
          left: `${leftPercent}%`,
          width: `${Math.max(widthPercent, 2)}%`,
          background: `linear-gradient(90deg, ${accentColor}40, ${accentColor})`,
          boxShadow: `0 0 8px ${accentColor}40`,
        }}
      />
      {/* Low marker */}
      <div
        className="-translate-y-1/2 absolute top-1/2 h-3 w-1 rounded-full bg-success-500"
        style={{ left: `${leftPercent}%` }}
        title={`Low: ${formatCurrency(lowest)}`}
      />
      {/* High marker */}
      <div
        className="-translate-y-1/2 absolute top-1/2 h-3 w-1 rounded-full bg-danger-500"
        style={{ left: `${leftPercent + widthPercent}%` }}
        title={`High: ${formatCurrency(highest)}`}
      />
    </div>
  );
};

interface RangeSectionProps {
  label: string;
  highest: number;
  lowest: number;
  highestDate?: string;
  lowestDate?: string;
  globalMin: number;
  globalMax: number;
  accentColor: string;
}

const RangeSection = ({
  label,
  highest,
  lowest,
  highestDate,
  lowestDate,
  globalMin,
  globalMax,
  accentColor,
}: RangeSectionProps) => {
  const spread = highest - lowest;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Chip size="sm" variant="flat" className="font-medium">
          {label}
        </Chip>
        <span className="text-default-400 text-xs">
          Spread: {formatCurrency(spread)}
        </span>
      </div>

      <RangeBar
        lowest={lowest}
        highest={highest}
        globalMin={globalMin}
        globalMax={globalMax}
        accentColor={accentColor}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Low value */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success-500" />
            <span className="text-default-500 text-xs uppercase tracking-wider">
              Low
            </span>
          </div>
          <span className="font-semibold text-foreground text-lg tabular-nums">
            {formatCurrency(lowest)}
          </span>
          {lowestDate && (
            <Typography.Caption>
              {formatDateToMonthYear(lowestDate)}
            </Typography.Caption>
          )}
        </div>

        {/* High value */}
        <div className="flex flex-col gap-0.5 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-default-500 text-xs uppercase tracking-wider">
              High
            </span>
            <div className="h-2 w-2 rounded-full bg-danger-500" />
          </div>
          <span className="font-semibold text-foreground text-lg tabular-nums">
            {formatCurrency(highest)}
          </span>
          {highestDate && (
            <Typography.Caption>
              {formatDateToMonthYear(highestDate)}
            </Typography.Caption>
          )}
        </div>
      </div>
    </div>
  );
};

export const PremiumRangeCard = ({ stats }: PremiumRangeCardProps) => {
  // Calculate global min/max for consistent range bar scaling
  const allPremiums = stats.flatMap((s) => [
    s.allTime.lowest,
    s.allTime.highest,
    ...(s.ytd ? [s.ytd.lowest, s.ytd.highest] : []),
  ]);
  const globalMin = Math.min(...allPremiums);
  const globalMax = Math.max(...allPremiums);

  return (
    <>
      {stats.map((stat) => {
        const accentColor = CATEGORY_COLOR_MAP[stat.category] || "#6366f1";
        const currentYear = new Date().getFullYear();

        return (
          <Card
            key={stat.category}
            className="group relative overflow-hidden transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Accent bar at top */}
            <div
              className="absolute top-0 right-0 left-0 h-1"
              style={{ backgroundColor: accentColor }}
            />

            <CardHeader className="flex flex-col items-start gap-1 pt-4">
              <Typography.H4>{stat.category}</Typography.H4>
              <Typography.Caption>Premium range analysis</Typography.Caption>
            </CardHeader>

            <CardBody className="flex flex-col gap-6 pt-0">
              {/* YTD Range */}
              {stat.ytd ? (
                <RangeSection
                  label={`${currentYear} YTD`}
                  highest={stat.ytd.highest}
                  lowest={stat.ytd.lowest}
                  highestDate={stat.ytd.highestDate}
                  lowestDate={stat.ytd.lowestDate}
                  globalMin={globalMin}
                  globalMax={globalMax}
                  accentColor={accentColor}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <Chip size="sm" variant="flat" className="font-medium">
                    {currentYear} YTD
                  </Chip>
                  <Typography.TextSm className="text-default-400">
                    No data available for {currentYear}
                  </Typography.TextSm>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-divider" />

              {/* All-time Range */}
              <RangeSection
                label="All-time"
                highest={stat.allTime.highest}
                lowest={stat.allTime.lowest}
                highestDate={stat.allTime.highestDate}
                lowestDate={stat.allTime.lowestDate}
                globalMin={globalMin}
                globalMax={globalMax}
                accentColor={accentColor}
              />
            </CardBody>
          </Card>
        );
      })}
    </>
  );
};
