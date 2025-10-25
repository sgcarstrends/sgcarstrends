"use client";

import { Alert } from "@heroui/alert";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Currency } from "@web/components/shared/currency";
import type { Pqp } from "@web/types/coe";
import { Bike, Calculator, Car, type LucideIcon, Truck } from "lucide-react";
import { useMemo, useState } from "react";

interface PQPCalculatorProps {
  data: Pqp.CategorySummary[];
}

interface CoeCategory {
  key: keyof Pqp.Rates;
  label: string;
  description: string;
  icon: LucideIcon;
}

const coeCategories: CoeCategory[] = [
  {
    key: "Category A",
    label: "Category A",
    description: "≤1600cc, ≤130bhp",
    icon: Car,
  },
  {
    key: "Category B",
    label: "Category B",
    description: ">1600cc or >130bhp",
    icon: Car,
  },
  {
    key: "Category C",
    label: "Category C",
    description: "Goods Vehicles & Buses",
    icon: Truck,
  },
  {
    key: "Category D",
    label: "Category D",
    description: "Motorcycles",
    icon: Bike,
  },
];

const buildRecommendation = (
  savings5Year: number,
  savings10Year: number,
): string => {
  if (savings5Year > 0) {
    return "PQP renewal is currently more cost-effective than bidding. Consider the 5-year option for flexibility or 10-year for maximum value.";
  }
  if (savings10Year > 0) {
    return "Current bidding may be cheaper than 5-year PQP, but 10-year PQP offers better value. Consider market volatility and your long-term plans.";
  }
  return "Current market bidding appears more cost-effective than PQP renewal. However, consider bidding uncertainty and your risk tolerance.";
};

export const RenewalCalculator = ({ data }: PQPCalculatorProps) => {
  const renewalRecords = useMemo<Pqp.RenewalRecord[]>(() => {
    return data.map((record) => ({
      category: record.category as keyof Pqp.Rates,
      pqpRate: record.pqpRate,
      coePremium: record.coePremium,
      pqpCost5Year: record.pqpCost5Year,
      pqpCost10Year: record.pqpCost10Year,
      pqpSavings5Year: record.savings5Year,
      pqpSavings10Year: record.savings10Year,
      recommendation: buildRecommendation(
        record.savings5Year,
        record.savings10Year,
      ),
    }));
  }, [data]);

  const [selectedCategory, setSelectedCategory] =
    useState<keyof Pqp.Rates>("Category A");
  const selectedRecord = renewalRecords.find(
    ({ category }) => category === selectedCategory,
  );

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-2 p-4">
        <div className="flex items-center gap-2">
          <Calculator />
          <h3 className="font-semibold text-lg">PQP vs Bidding Calculator</h3>
        </div>
        <p className="text-default-500 text-small">
          Compare costs between PQP renewal and current market bidding
        </p>
      </CardHeader>
      <CardBody className="gap-4">
        <Tabs
          color="primary"
          radius="full"
          selectedKey={selectedCategory}
          onSelectionChange={(key) =>
            setSelectedCategory(key as keyof Pqp.Rates)
          }
        >
          {coeCategories.map(({ key, icon: Icon, label }) => {
            const categoryRecord = renewalRecords.find(
              ({ category }) => category === key,
            );
            const currentPQPRate = categoryRecord?.pqpRate ?? 0;
            const currentCOEPremium = categoryRecord?.coePremium ?? 0;

            return (
              <Tab
                key={key}
                title={
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </div>
                }
              >
                <div className="mt-4 flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="border bg-default-50">
                      <CardBody className="text-center">
                        <h4 className="mb-1 font-medium text-default-600 text-sm">
                          Current PQP Rate
                        </h4>
                        <p className="font-bold text-xl">
                          <Currency value={currentPQPRate} />
                        </p>
                        <p className="text-default-500 text-xs">
                          Latest available rate
                        </p>
                      </CardBody>
                    </Card>

                    <Card className="border bg-default-50">
                      <CardBody className="text-center">
                        <h4 className="mb-1 font-medium text-default-600 text-sm">
                          Current COE Price
                        </h4>
                        <p className="font-bold text-xl">
                          <Currency value={currentCOEPremium} />
                        </p>
                        <p className="text-default-500 text-xs">
                          Latest COE premium
                        </p>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>
            );
          })}
        </Tabs>
        {selectedRecord && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border">
                <CardBody className="text-center">
                  <h4 className="font-medium text-default-500 text-sm">
                    PQP 5-Year Renewal (Estimate)
                  </h4>
                  <p className="font-bold text-2xl">
                    <Currency value={selectedRecord.pqpCost5Year} />
                  </p>
                  <p
                    className={`text-sm ${
                      selectedRecord.pqpSavings5Year > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedRecord.pqpSavings5Year > 0 ? "Saves" : "Costs"}{" "}
                    <Currency
                      value={Math.abs(selectedRecord.pqpSavings5Year)}
                    />
                  </p>
                </CardBody>
              </Card>

              <Card className="border">
                <CardBody className="text-center">
                  <h4 className="font-medium text-default-500 text-sm">
                    PQP 10-Year Renewal (Estimate)
                  </h4>
                  <p className="font-bold text-2xl">
                    <Currency value={selectedRecord.pqpCost10Year} />
                  </p>
                  <p
                    className={`text-sm ${
                      selectedRecord.pqpSavings10Year > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedRecord.pqpSavings10Year > 0 ? "Saves" : "Costs"}{" "}
                    <Currency
                      value={Math.abs(selectedRecord.pqpSavings10Year)}
                    />
                  </p>
                </CardBody>
              </Card>
            </div>

            <Alert
              hideIconWrapper
              color="primary"
              variant="bordered"
              title="Note"
              description={selectedRecord.recommendation}
            />

            <div className="flex flex-col gap-1 text-default-500 text-xs">
              <p>
                * All calculations are estimates only and exclude processing
                fees, registration fees, and other charges
              </p>
              <p>* Actual costs may vary significantly from these estimates</p>
              <p>
                * PQP rates are based on 3-month moving averages and updated
                monthly
              </p>
              <p>* Bidding prices are estimates based on recent market data</p>
              <p>
                * Consider vehicle condition, maintenance costs, and personal
                circumstances
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
