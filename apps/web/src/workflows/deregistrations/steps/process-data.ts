import { deregistrations } from "@sgcarstrends/database";
import type { Deregistration } from "@sgcarstrends/types";
import { LTA_DATAMALL_BASE_URL } from "@web/config/workflow";
import { Updater } from "@web/lib/updater";

export const updateDeregistration = () => {
  const filename =
    "Monthly De-Registered Motor Vehicles under Vehicle Quota System (VQS).zip";
  const url = `${LTA_DATAMALL_BASE_URL}/${filename}`;
  const keyFields: Array<keyof Deregistration> = ["month", "category"];

  const updater = new Updater<Deregistration>({
    table: deregistrations,
    url,
    keyFields,
    csvTransformOptions: {
      fields: {
        number: (value: string | number) => (value === "" ? 0 : Number(value)),
      },
    },
  });

  return updater.update();
};
