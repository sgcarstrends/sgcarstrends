import { Card, CardBody } from "@heroui/card";
import Typography from "@web/components/typography";
import { ArrowDown, Table } from "lucide-react";

const BRACKETS = [
  {
    age: "5 years or younger",
    oldRate: "75%",
    newRate: "30%",
    change: "-45pp",
  },
  { age: ">5 to 6 years", oldRate: "70%", newRate: "25%", change: "-45pp" },
  { age: ">6 to 7 years", oldRate: "65%", newRate: "20%", change: "-45pp" },
  { age: ">7 to 8 years", oldRate: "60%", newRate: "15%", change: "-45pp" },
  { age: ">8 to 9 years", oldRate: "55%", newRate: "10%", change: "-45pp" },
  { age: ">9 to 10 years", oldRate: "50%", newRate: "5%", change: "-45pp" },
  { age: "Over 10 years", oldRate: "0%", newRate: "0%", change: null },
];

export function PARFComparisonTable() {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardBody className="flex flex-col gap-0 p-0">
        <div className="flex items-center gap-2 px-6 py-4">
          <Table className="size-4 text-primary" />
          <Typography.H4>PARF Rebate Rate Comparison</Typography.H4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-default-200 border-y bg-default-50">
                <th className="px-6 py-2 text-left font-semibold text-default-600 text-xs uppercase tracking-wider">
                  Vehicle Age
                </th>
                <th className="px-6 py-2 text-center font-semibold text-default-600 text-xs uppercase tracking-wider">
                  Old Rate
                </th>
                <th className="px-6 py-2 text-center font-semibold text-primary text-xs uppercase tracking-wider">
                  New Rate
                </th>
                <th className="px-6 py-2 text-right font-semibold text-danger text-xs uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {BRACKETS.map((row) => (
                <tr
                  key={row.age}
                  className="border-default-100 border-b transition-colors last:border-b-0 hover:bg-default-50"
                >
                  <td className="px-6 py-2 font-medium">{row.age}</td>
                  <td className="px-6 py-2 text-center text-default-500">
                    {row.oldRate}
                  </td>
                  <td className="px-6 py-2 text-center font-semibold text-primary">
                    {row.newRate}
                  </td>
                  <td className="px-6 py-2 text-right">
                    {row.change ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-danger text-xs">
                        <ArrowDown className="size-4" />
                        {row.change}
                      </span>
                    ) : (
                      <span className="text-default-400 text-xs">
                        No change
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col justify-between gap-2 border-default-200 border-t bg-default-50 px-6 py-4 text-default-500 text-xs sm:flex-row">
          <span>
            Rebate Cap: <strong className="text-foreground">$60,000</strong>{" "}
            (old) &rarr; <strong className="text-foreground">$30,000</strong>{" "}
            (new)
          </span>
          <span>Effective: 2nd COE bidding, Feb 2026</span>
        </div>
      </CardBody>
    </Card>
  );
}
