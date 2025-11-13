import { LTA_DATAMALL_BASE_URL } from "@api/config";
import { Updater } from "@api/lib/updater";
import type { COE, PQP } from "@api/types";
import { coe, pqp } from "@sgcarstrends/database";

export const updateCoe = async () => {
  const filename = "COE Bidding Results.zip";
  const url = `${LTA_DATAMALL_BASE_URL}/${filename}`;

  const parseNumericString = (value: string | number) => {
    if (typeof value === "string") {
      return Number.parseInt(value.replace(/,/g, ""), 10);
    }

    return value;
  };

  // Update COE bidding results
  const coeKeyFields: Array<keyof COE> = ["month", "bidding_no"];
  const parseNumericFields: Array<keyof COE> = [
    "quota",
    "bids_success",
    "bids_received",
  ];

  const coeUpdater = new Updater<COE>({
    table: coe,
    url,
    csvFile: "M11-coe_results.csv",
    keyFields: coeKeyFields,
    csvTransformOptions: {
      fields: Object.fromEntries(
        parseNumericFields.map((field) => [field, parseNumericString]),
      ),
    },
  });

  const coeResult = await coeUpdater.update();
  console.log("[COE]", coeResult);

  // Update COE PQP (Prevailing Quota Premium)
  const pqpKeyFields: Array<keyof PQP> = ["month", "vehicle_class", "pqp"];

  const pqpUpdater = new Updater<PQP>({
    table: pqp,
    url,
    csvFile: "M11-coe_results_pqp.csv",
    keyFields: pqpKeyFields,
  });

  const pqpResult = await pqpUpdater.update();
  console.log("[COE PQP]", pqpResult);

  return coeResult;
};

export const handler = async () => {
  const response = await updateCoe();
  return { statusCode: 200, body: response };
};
