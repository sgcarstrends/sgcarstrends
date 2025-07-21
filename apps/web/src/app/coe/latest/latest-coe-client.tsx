"use client";

import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import { LatestCOEPrices } from "@/components/latest-coe-prices";
import { PageHeader } from "@/components/page-header";
import Typography from "@/components/typography";
import { UnreleasedFeature } from "@/components/unreleased-feature";
import { formatDateToMonthYear } from "@/utils/format-date-to-month-year";
import type { COEResult } from "@/types";

interface LatestCOEClientProps {
  results: COEResult[];
  lastUpdated: number | null;
}

export const LatestCOEClient = ({
  results,
  lastUpdated,
}: LatestCOEClientProps) => {
  // Get the latest bidding information
  const latestBidding = results[0];
  const biddingMonth = latestBidding?.month;
  const biddingNumber = latestBidding?.bidding_no;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Latest COE Prices" lastUpdated={lastUpdated} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {biddingMonth && biddingNumber && (
              <div className="flex flex-wrap items-center gap-3">
                <Chip
                  variant="shadow"
                  color="primary"
                  size="lg"
                  classNames={{
                    base: "bg-gradient-to-r from-primary to-primary/80",
                  }}
                >
                  Round {biddingNumber} of 2
                </Chip>
              </div>
            )}
            <h3 className="text-xl font-bold">
              {biddingMonth && formatDateToMonthYear(biddingMonth)} COE Result
            </h3>
          </div>
        </div>
        <LatestCOEPrices results={results} />
      </div>

      <UnreleasedFeature>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Explore COE Data</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <Link href="/coe/trends">
                <Button variant="bordered" className="w-full">
                  View COE Trends
                </Button>
              </Link>
              <Link href="/coe/results">
                <Button variant="bordered" className="w-full">
                  Historical Results
                </Button>
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">COE Categories</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <Link href="/coe/categories/category-a">
                <Button variant="bordered" className="w-full">
                  Category A Analysis
                </Button>
              </Link>
              <Link href="/coe/categories/category-b">
                <Button variant="bordered" className="w-full">
                  Category B Analysis
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </UnreleasedFeature>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">About COE</h3>
        </CardHeader>
        <CardBody>
          <Typography.P>
            The Certificate of Entitlement (COE) is a quota system used in
            Singapore to control the number of vehicles on the road. COE prices
            are determined through a bidding process and vary by vehicle
            category.
          </Typography.P>
        </CardBody>
        <CardFooter>
          <Link href="/coe" className="w-full">
            <Button variant="solid" color="primary" className="w-full">
              Learn More About COE
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
