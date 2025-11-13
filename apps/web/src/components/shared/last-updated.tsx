import Typography from "@web/components/typography";
import { format } from "date-fns";

interface Props {
  lastUpdated: number;
}

export const LastUpdated = ({ lastUpdated }: Props) => (
  <Typography.Caption>
    Last updated:{" "}
    <span className="underline">
      {format(lastUpdated, "dd MMM yyyy, h:mma")}
    </span>
  </Typography.Caption>
);
