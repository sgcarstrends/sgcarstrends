import { Card, CardBody, CardHeader } from "@heroui/card";
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
        <CardHeader className="flex flex-col items-start gap-2">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          {subtitle && <p className="text-default-600 text-sm">{subtitle}</p>}
        </CardHeader>
        <CardBody>
          <div className="flex h-60 items-center justify-center rounded-lg bg-default-100">
            <p className="text-default-500">{emptyMessage}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-2">
        <h3 className="font-semibold text-foreground text-lg">{title}</h3>
        {subtitle && <p className="text-default-600 text-sm">{subtitle}</p>}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};
