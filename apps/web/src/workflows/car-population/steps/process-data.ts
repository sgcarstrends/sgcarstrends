import path from "node:path";
import {
  carPopulation,
  db,
  getTableName,
  inArray,
} from "@sgcarstrends/database";
import type { CarPopulation } from "@sgcarstrends/types";
import { createUniqueKey } from "@sgcarstrends/utils";
import { AWS_LAMBDA_TEMP_DIR } from "@web/config/workflow";
import type { UpdaterResult } from "@web/lib/updater";
import { calculateChecksum } from "@web/lib/updater/services/calculate-checksum";
import { downloadFile } from "@web/lib/updater/services/download-file";
import { processCsv } from "@web/lib/updater/services/process-csv";
import { Checksum } from "@web/utils/checksum";

const CAR_POPULATION_URL =
  "https://datamall.lta.gov.sg/content/dam/datamall/datasets/Facts_Figures/Vehicle Population/Annual Car Population by Make.zip";

const KEY_FIELDS: Array<keyof CarPopulation> = ["year", "make", "fuelType"];

const BATCH_SIZE = 5000;

export async function updateCarPopulation(): Promise<UpdaterResult> {
  const tableName = getTableName(carPopulation);
  const checksum = new Checksum();

  // Download and extract
  const extractedFileName = await downloadFile(CAR_POPULATION_URL);
  const destinationPath = path.join(AWS_LAMBDA_TEMP_DIR, extractedFileName);
  console.log("Destination path:", destinationPath);

  // Calculate and verify checksum
  const fileChecksum = await calculateChecksum(destinationPath);
  console.log("Checksum:", fileChecksum);

  const cachedChecksum = await checksum.getCachedChecksum(extractedFileName);
  console.log("Cached checksum:", cachedChecksum);

  if (!cachedChecksum) {
    console.log("No cached checksum found. This might be the first run.");
    await checksum.cacheChecksum(extractedFileName, fileChecksum);
  } else if (cachedChecksum === fileChecksum) {
    console.log(
      `File has not changed since last update (Checksum: ${fileChecksum})`,
    );
    return {
      table: tableName,
      recordsProcessed: 0,
      message: "File has not changed since last update",
      timestamp: new Date().toISOString(),
    };
  } else {
    await checksum.cacheChecksum(extractedFileName, fileChecksum);
    console.log("Checksum has been changed.");
  }

  // Process CSV with column mapping
  const processedData = await processCsv<CarPopulation>(destinationPath, {
    columnMapping: {
      fuel_type: "fuelType",
    },
    fields: {
      number: (value: string) => (value === "" ? 0 : Number(value)),
    },
  });

  // Year-based deduplication
  const incomingYears = new Set(processedData.map((record) => record.year));

  const existingYearsQuery = await db
    .selectDistinct({ year: carPopulation.year })
    .from(carPopulation);
  const existingYears = new Set(existingYearsQuery.map((r) => r.year));

  const newYears = incomingYears.difference(existingYears);

  console.log(
    `Year analysis: ${incomingYears.size} incoming, ${existingYears.size} existing, ${newYears.size} new`,
  );

  // Records from brand new years skip key comparison
  const recordsFromNewYears: CarPopulation[] = [];
  const recordsFromOverlappingYears: CarPopulation[] = [];

  for (const record of processedData) {
    if (newYears.has(record.year)) {
      recordsFromNewYears.push(record);
    } else {
      recordsFromOverlappingYears.push(record);
    }
  }

  console.log(
    `Records: ${recordsFromNewYears.length} from new years, ${recordsFromOverlappingYears.length} from overlapping years`,
  );

  // Key-level comparison for overlapping years
  let newRecordsFromOverlapping: CarPopulation[] = [];

  if (recordsFromOverlappingYears.length > 0) {
    const overlappingYears = incomingYears.intersection(existingYears);

    const existingKeysQuery = await db
      .select({
        year: carPopulation.year,
        make: carPopulation.make,
        fuelType: carPopulation.fuelType,
      })
      .from(carPopulation)
      .where(inArray(carPopulation.year, [...overlappingYears]));

    const existingKeys = new Set(
      existingKeysQuery.map((record) => createUniqueKey(record, KEY_FIELDS)),
    );

    const incomingKeys = new Set(
      recordsFromOverlappingYears.map((record) =>
        createUniqueKey(
          record as unknown as Record<string, unknown>,
          KEY_FIELDS,
        ),
      ),
    );

    if (incomingKeys.isSubsetOf(existingKeys)) {
      console.log(
        "Early exit: all records from overlapping years already exist",
      );
    } else {
      newRecordsFromOverlapping = recordsFromOverlappingYears.filter(
        (record) => {
          const identifier = createUniqueKey(
            record as unknown as Record<string, unknown>,
            KEY_FIELDS,
          );
          return !existingKeys.has(identifier);
        },
      );
    }
  }

  const newRecords = [...recordsFromNewYears, ...newRecordsFromOverlapping];

  if (newRecords.length === 0) {
    return {
      table: tableName,
      recordsProcessed: 0,
      message:
        "No new data to insert. The provided data matches the existing records.",
      timestamp: new Date().toISOString(),
    };
  }

  // Batch insert
  let totalInserted = 0;
  const start = performance.now();

  for (let i = 0; i < newRecords.length; i += BATCH_SIZE) {
    const batch = newRecords.slice(i, i + BATCH_SIZE);
    const inserted = await db.insert(carPopulation).values(batch).returning();
    totalInserted += inserted.length;
    console.log(
      `Inserted batch of ${inserted.length} records. Total: ${totalInserted}`,
    );
  }

  const end = performance.now();
  console.log(
    `Inserted ${totalInserted} record(s) in ${Math.round(end - start)}ms`,
  );

  return {
    table: tableName,
    recordsProcessed: totalInserted,
    message: `${totalInserted} record(s) inserted`,
    timestamp: new Date().toISOString(),
  };
}
