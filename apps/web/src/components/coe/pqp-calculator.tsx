"use client";

import { Alert } from "@heroui/alert";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import type { COEResult, PQP } from "@web/types";
import { Bike, Calculator, Car, Truck } from "lucide-react";
import { useEffect, useState } from "react";

interface CalculatorResult {
  pqpCost5Year: number;
  pqpCost10Year: number;
  estimatedBiddingCost: number;
  pqpSavings5Year: number;
  pqpSavings10Year: number;
  recommendation: string;
  currentPQPRate: number;
  estimatedBiddingPrice: number;
  estimatedBiddingCost5Year: number;
}

interface PQPCalculatorProps {
  pqpData: Record<string, PQP>;
  latestCOEResults: COEResult[];
}

const coeCategories = [
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

export const PQPCalculator = ({
  pqpData,
  latestCOEResults,
}: PQPCalculatorProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Category A");
  const [result, setResult] = useState<CalculatorResult | null>(null);

  // Get the latest PQP data (most recent month)
  const latestPQPMonth = Object.keys(pqpData).sort().pop();
  const latestPQP = latestPQPMonth ? pqpData[latestPQPMonth] : null;

  // Get current COE premium for selected category
  const getCurrentCOEPremium = (category: string) => {
    const coeResult = latestCOEResults.find(
      (result) => result.vehicle_class === category,
    );
    return coeResult?.premium || 0;
  };

  // Get current PQP rate for selected category
  const getCurrentPQPRate = (category: string) => {
    if (!latestPQP) return 0;

    const categoryMap: Record<string, keyof PQP> = {
      "Category A": "Category A",
      "Category B": "Category B",
      "Category C": "Category C",
      "Category D": "Category D",
    };

    const pqpKey = categoryMap[category];
    return pqpKey ? latestPQP[pqpKey] : 0;
  };

  const calculateCosts = () => {
    if (!selectedCategory) {
      setResult(null);
      return;
    }

    const currentPQPRate = getCurrentPQPRate(selectedCategory);
    const estimatedBiddingPrice = getCurrentCOEPremium(selectedCategory);

    if (!currentPQPRate || !estimatedBiddingPrice) {
      setResult(null);
      return;
    }

    const pqpCost5Year = currentPQPRate * 0.5;
    const pqpCost10Year = currentPQPRate;
    const estimatedBiddingCost = estimatedBiddingPrice;
    const estimatedBiddingCost5Year = estimatedBiddingPrice * 0.5;

    const pqpSavings5Year = estimatedBiddingCost5Year - pqpCost5Year;
    const pqpSavings10Year = estimatedBiddingCost - pqpCost10Year;

    let recommendation = "";
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

    setResult({
      pqpCost5Year,
      pqpCost10Year,
      estimatedBiddingCost,
      pqpSavings5Year,
      pqpSavings10Year,
      recommendation,
      currentPQPRate,
      estimatedBiddingPrice,
      estimatedBiddingCost5Year,
    });
  };

  useEffect(() => {
    calculateCosts();
  }, [selectedCategory, pqpData, latestCOEResults]);

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
          onSelectionChange={(key) => setSelectedCategory(key as string)}
        >
          {coeCategories.map(({ key, icon: Icon, label }) => {
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
                          S${getCurrentPQPRate(key).toLocaleString()}
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
                          S$
                          {getCurrentCOEPremium(key).toLocaleString()}
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

        {result && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border">
                <CardBody className="text-center">
                  <h4 className="font-medium text-default-500 text-sm">
                    PQP 5-Year Renewal (Estimate)
                  </h4>
                  <p className="font-bold text-2xl">
                    S${result.pqpCost5Year.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      result.pqpSavings5Year > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.pqpSavings5Year > 0 ? "Saves" : "Costs"} S$
                    {Math.abs(result.pqpSavings5Year).toLocaleString()}
                  </p>
                </CardBody>
              </Card>

              <Card className="border">
                <CardBody className="text-center">
                  <h4 className="font-medium text-default-500 text-sm">
                    PQP 10-Year Renewal (Estimate)
                  </h4>
                  <p className="font-bold text-2xl">
                    S${result.pqpCost10Year.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      result.pqpSavings10Year > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.pqpSavings10Year > 0 ? "Saves" : "Costs"} S$
                    {Math.abs(result.pqpSavings10Year).toLocaleString()}
                  </p>
                </CardBody>
              </Card>
            </div>

            <Alert
              hideIconWrapper
              color="primary"
              variant="bordered"
              title="Note"
              description={result.recommendation}
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
