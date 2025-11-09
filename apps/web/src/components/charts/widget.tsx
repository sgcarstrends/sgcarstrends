import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import type { ReactNode } from "react";

interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const ChartWidget = ({
  title,
  subtitle,
  children,
  isEmpty = false,
  emptyMessage = "No data available",
}: ChartWidgetProps) => {
  if (isEmpty) {
    return (
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="font-semibold text-gray-900 text-lg">
            {title}
          </CardTitle>
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="flex h-60 items-center justify-center rounded-lg bg-gray-50">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle className="font-semibold text-gray-900 text-lg">
          {title}
        </CardTitle>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
