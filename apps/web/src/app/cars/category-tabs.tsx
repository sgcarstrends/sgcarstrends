"use client";

import { Tab, Tabs } from "@heroui/tabs";
import { StatCard } from "@web/components/stat-card";
import type { Registration } from "@web/types/cars";

interface Props {
  cars: Registration;
}

export const CategoryTabs = ({ cars }: Props) => {
  return (
    <Tabs variant="underlined">
      <Tab key="fuelType" title="By Fuel Type">
        <StatCard
          title="By Fuel Type"
          description="Distribution of vehicles based on fuel type"
          data={cars.fuelType}
          total={cars.total}
          linkPrefix="fuel-types"
        />
      </Tab>
      <Tab key="vehicleType" title="By Vehicle Type">
        <StatCard
          title="By Vehicle Type"
          description="Distribution of vehicles based on vehicle type"
          data={cars.vehicleType}
          total={cars.total}
          linkPrefix="vehicle-types"
        />
      </Tab>
    </Tabs>
  );
};
