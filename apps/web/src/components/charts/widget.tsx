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
      <Card className="p-3">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <p className="font-medium">{title}</p>
            {subtitle && <p className="text-default-500 text-sm">{subtitle}</p>}
          </div>
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
    <Card className="p-3">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{title}</p>
          {subtitle && <p className="text-default-500 text-sm">{subtitle}</p>}
        </div>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};
