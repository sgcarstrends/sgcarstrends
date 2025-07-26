import Link from "next/link";
import slugify from "@sindresorhus/slugify";
import { TrendChart } from "@web/app/cars/trend-chart";
import { AnimatedNumber } from "@web/components/animated-number";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

interface Props {
  cars: any[];
  total: number;
}

export const CarOverviewTrends = ({ cars, total }: Props) => (
  <div className="grid grid-cols-1 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>By Make</CardTitle>
        <CardDescription>Top 10 makes</CardDescription>
      </CardHeader>
      <CardContent>
        <TrendChart data={cars} />
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stats</CardTitle>
          <CardDescription>
            <span className="font-bold">{total}</span> registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cars.length > 0 &&
            cars.map(({ make, count }) => {
              const marketShare = (count: number) => count / total;

              return (
                <div
                  key={make}
                  className="flex items-center justify-between border-b py-2"
                >
                  <Link href={`/cars/makes/${slugify(make)}`}>{make}</Link>
                  <div className="flex items-center gap-2">
                    <AnimatedNumber value={count} />
                    <progress
                      className="progress w-32"
                      value={marketShare(count)}
                    />
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  </div>
);
