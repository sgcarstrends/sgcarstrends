"use client";

import { Alert } from "@heroui/alert";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Currency } from "@web/components/currency";
import type { COEResult, PQP } from "@web/types";
import { Bike, Calculator, Car, type LucideIcon, Truck } from "lucide-react";
import { useMemo, useState } from "react";

interface CalculatorResult {
  pqpCost5Year: number;
  pqpCost10Year: number;
  pqpSavings5Year: number;
  pqpSavings10Year: number;
  recommendation: string;
}

interface PQPCalculatorProps {
  pqpData: Record<string, PQP>;
  latestCOEResults: COEResult[];
}

interface CoeCategory {
  key: keyof PQP;
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

const pqpCategories = coeCategories.map(({ key }) => key);

const isPQPEnabledCategory = (
  category: COEResult["vehicle_class"],
): category is keyof PQP => pqpCategories.includes(category as keyof PQP);

export const PQPCalculator = ({
  pqpData,
  latestCOEResults,
}: PQPCalculatorProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof PQP>("Category A");

  const latestPQP = useMemo(() => {
    const months = Object.keys(pqpData);
    if (months.length === 0) {
      return null;
    }

    const latestMonth = months.sort().pop();
    return latestMonth ? pqpData[latestMonth] : null;
  }, [pqpData]);

  const latestCOEPremiums = useMemo(
    () =>
      latestCOEResults.reduce<Partial<Record<keyof PQP, number>>>(
        (accumulator, entry) => {
          if (isPQPEnabledCategory(entry.vehicle_class)) {
            const category = entry.vehicle_class;

            if (accumulator[category] === undefined) {
              accumulator[category] = entry.premium;
            }
          }

          return accumulator;
        },
        {},
      ),
    [latestCOEResults],
  );

  const calculatorResult = useMemo<CalculatorResult | null>(() => {
    const currentPQPRate = latestPQP?.[selectedCategory] ?? 0;
    const estimatedBiddingPrice = latestCOEPremiums[selectedCategory] ?? 0;

    if (!currentPQPRate || !estimatedBiddingPrice) {
      return null;
    }

    const pqpCost5Year = currentPQPRate * 0.5;
    const pqpCost10Year = currentPQPRate;
    const estimatedBiddingCost5Year = estimatedBiddingPrice * 0.5;

    const pqpSavings5Year = estimatedBiddingCost5Year - pqpCost5Year;
    const pqpSavings10Year = estimatedBiddingPrice - pqpCost10Year;

    let recommendation: string;

    if (pqpSavings5Year > 0) {
      recommendation =
        "PQP renewal is currently more cost-effective than bidding. Consider the 5-year option for flexibility or 10-year for maximum value.";
    } else if (pqpSavings10Year > 0) {
      recommendation =
        "Current bidding may be cheaper than 5-year PQP, but 10-year PQP offers better value. Consider market volatility and your long-term plans.";
    } else {
      recommendation =
        "Current market bidding appears more cost-effective than PQP renewal. However, consider bidding uncertainty and your risk tolerance.";
    }

    return {
      pqpCost5Year,
      pqpCost10Year,
      pqpSavings5Year,
      pqpSavings10Year,
      recommendation,
    };
  }, [latestCOEPremiums, latestPQP, selectedCategory]);

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
          onSelectionChange={(key) => setSelectedCategory(key as keyof PQP)}
        >
          {coeCategories.map(({ key, icon: Icon, label }) => {
            const currentPQPRate = latestPQP?.[key] ?? 0;
            const currentCOEPremium = latestCOEPremiums[key] ?? 0;

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
        {calculatorResult && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border">
                <CardBody className="text-center">
                  <h4 className="font-medium text-default-500 text-sm">
                    PQP 5-Year Renewal (Estimate)
                  </h4>
                  <p className="font-bold text-2xl">
                    <Currency value={calculatorResult.pqpCost5Year} />
                  </p>
                  <p
                    className={`text-sm ${
                      calculatorResult.pqpSavings5Year > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {calculatorResult.pqpSavings5Year > 0 ? "Saves" : "Costs"}{" "}
                    <Currency
                      value={Math.abs(calculatorResult.pqpSavings5Year)}
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
                    <Currency value={calculatorResult.pqpCost10Year} />
                  </p>
                  <p
                    className={`text-sm ${
                      calculatorResult.pqpSavings10Year > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {calculatorResult.pqpSavings10Year > 0 ? "Saves" : "Costs"}{" "}
                    <Currency
                      value={Math.abs(calculatorResult.pqpSavings10Year)}
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
              description={calculatorResult.recommendation}
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
