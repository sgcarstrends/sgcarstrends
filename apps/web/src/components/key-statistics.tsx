"use client";

import useStore from "@/app/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  data: { year: number; total: number }[];
}

export const KeyStatistics = ({ data }: Props) => {
  const selectedYear = useStore(({ selectedYear }) => selectedYear);
  const setSelectedYear = useStore(({ setSelectedYear }) => setSelectedYear);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <Select
              onValueChange={(year) => setSelectedYear(year)}
              defaultValue={selectedYear}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {data
                  .toSorted((a, b) => b.year - a.year)
                  .map((item) => (
                    <SelectItem key={item.year} value={item.year.toString()}>
                      {item.year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <p>
            Total Registrations in {selectedYear}:{" "}
            {data.find((item) => item.year.toString() === selectedYear)?.total}
          </p>
          <p>
            Highest Year:{" "}
            {
              data.reduce(
                (max, item) => (item.total > max.total ? item : max),
                { total: -Infinity, year: 0 },
              ).year
            }
          </p>
          <p>
            Lowest Year:{" "}
            {
              data.reduce(
                (min, item) => (item.total < min.total ? item : min),
                { total: Infinity, year: 0 },
              ).year
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
