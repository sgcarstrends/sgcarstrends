import { LTA_DATAMALL_BASE_URL } from "@api/updater/config";
import type { COE, PQP } from "@api/updater/types";
import { coe, coePQP } from "@sgcarstrends/schema";
import { updater } from "./updater";

export const updateCOE = async () => {
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

  const coeResult = await updater<COE>({
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

  console.log("[COE]", coeResult);

  // Update COE PQP (Prevailing Quota Premium)
  const pqpKeyFields: Array<keyof PQP> = ["month", "vehicle_class", "pqp"];

  const pqpResult = await updater<PQP>({
    table: coePQP,
    url,
    csvFile: "M11-coe_results_pqp.csv",
    keyFields: pqpKeyFields,
  });

  console.log("[COE PQP]", pqpResult);

  return coeResult;
};

export const handler = async () => {
  const response = await updateCOE();
  return { statusCode: 200, body: response };
};
