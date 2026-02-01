import { cars } from "@sgcarstrends/database";
import type { Car } from "@sgcarstrends/types";
import { cleanSpecialChars } from "@sgcarstrends/utils";
import { LTA_DATAMALL_BASE_URL } from "@web/config/workflow";
import { Updater } from "@web/lib/updater";

export const updateCars = () => {
  const filename = "Monthly New Registration of Cars by Make.zip";
  const url = `${LTA_DATAMALL_BASE_URL}/${filename}`;
  const keyFields: Array<keyof Car> = [
    "month",
    "make",
    "fuelType",
    "vehicleType",
  ];

  const updater = new Updater<Car>({
    table: cars,
    url,
    keyFields,
    csvTransformOptions: {
      columnMapping: {
        fuel_type: "fuelType",
        vehicle_type: "vehicleType",
        importer_type: "importerType",
      },
      fields: {
        make: (value: string) =>
          cleanSpecialChars(value, { separator: "." }).toUpperCase(),
        vehicleType: (value: string) =>
          cleanSpecialChars(value, { separator: "/", joinSeparator: "/" }),
        number: (value: string | number) => (value === "" ? 0 : Number(value)),
      },
    },
  });

  return updater.update();
};
