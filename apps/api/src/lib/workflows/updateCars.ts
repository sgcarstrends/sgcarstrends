import { LTA_DATAMALL_BASE_URL } from "@api/config";
import { cars } from "@sgcarstrends/database";
import type { Car } from "@sgcarstrends/types";
import { cleanSpecialChars } from "@sgcarstrends/utils";
import { Updater } from "./updater";

export const updateCars = () => {
  const filename = "Monthly New Registration of Cars by Make.zip";
  const url = `${LTA_DATAMALL_BASE_URL}/${filename}`;
  const keyFields: Array<keyof Car> = [
    "month",
    "make",
    "fuel_type",
    "vehicle_type",
  ];

  const updater = new Updater<Car>({
    table: cars,
    url,
    keyFields,
    csvTransformOptions: {
      fields: {
        make: (value: string) =>
          cleanSpecialChars(value, { separator: "." }).toUpperCase(),
        vehicle_type: (value: string) =>
          cleanSpecialChars(value, { separator: "/", joinSeparator: "/" }),
        number: (value: string | number) => (value === "" ? 0 : Number(value)),
      },
    },
  });

  return updater.update();
};

export const handler = async () => {
  const response = await updateCars();
  return { statusCode: 200, body: response };
};
