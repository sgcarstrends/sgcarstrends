import dayjs from "dayjs";

interface Props {
  lastUpdated: number;
}

export const LastUpdated = ({ lastUpdated }: Props) => (
  <div className="text-muted-foreground text-xs">
    Last updated:{" "}
    <span className="underline">
      {dayjs(lastUpdated).format("DD MMM YYYY, h:mmA")}
    </span>
  </div>
);
