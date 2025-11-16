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
  const coeKeyFields: Array<keyof COE> = ["month", "biddingNo"];
  const coeParseNumericFields: Array<keyof COE> = [
    "quota",
    "bidsSuccess",
    "bidsReceived",
    "premium",
  ];

  const coeUpdater = new Updater<COE>({
    table: coe,
    url,
    csvFile: "M11-coe_results.csv",
    keyFields: coeKeyFields,
    csvTransformOptions: {
      columnMapping: {
        bidding_no: "biddingNo",
        vehicle_class: "vehicleClass",
        bids_success: "bidsSuccess",
        bids_received: "bidsReceived",
      },
      fields: Object.fromEntries(
        coeParseNumericFields.map((field) => [field, parseNumericString]),
      ),
    },
  });

  const coeResult = await coeUpdater.update();
  console.log("[COE]", coeResult);

  // Update COE PQP (Prevailing Quota Premium)
  const pqpKeyFields: Array<keyof PQP> = ["month", "vehicleClass", "pqp"];
  const pqpParseNumericFields: Array<keyof PQP> = ["pqp"];

  const pqpUpdater = new Updater<PQP>({
    table: pqp,
    url,
    csvFile: "M11-coe_results_pqp.csv",
    keyFields: pqpKeyFields,
    csvTransformOptions: {
      columnMapping: {
        vehicle_class: "vehicleClass",
      },
      fields: Object.fromEntries(
        pqpParseNumericFields.map((field) => [field, parseNumericString]),
      ),
    },
  });

  const pqpResult = await pqpUpdater.update();
  console.log("[COE PQP]", pqpResult);

  return coeResult;
};

export const handler = async () => {
  const response = await updateCoe();
  return { statusCode: 200, body: response };
};
