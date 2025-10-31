import Typography from "@web/components/typography";
import dayjs from "dayjs";

interface Props {
  lastUpdated: number;
}

export const LastUpdated = ({ lastUpdated }: Props) => (
  <Typography.Caption>
    Last updated:{" "}
    <span className="underline">
      {dayjs(lastUpdated).format("DD MMM YYYY, h:mmA")}
    </span>
  </Typography.Caption>
);
