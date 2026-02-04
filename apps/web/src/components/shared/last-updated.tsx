import Typography from "@web/components/typography";
import { format } from "date-fns";

interface LastUpdatedProps {
  lastUpdated: number;
}

export function LastUpdated({ lastUpdated }: LastUpdatedProps) {
  return (
    <Typography.Caption>
      Last updated:{" "}
      <span className="underline">
        {format(lastUpdated, "dd MMM yyyy, h:mma")}
      </span>
    </Typography.Caption>
  );
}
