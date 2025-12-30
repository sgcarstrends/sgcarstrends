import Typography from "@web/components/typography";
import { format } from "date-fns";

interface Props {
  lastUpdated: number;
}

export function LastUpdated({ lastUpdated }: Props) {
  return (
    <Typography.Caption>
      Last updated:{" "}
      <span className="underline">
        {format(lastUpdated, "dd MMM yyyy, h:mma")}
      </span>
    </Typography.Caption>
  );
}
