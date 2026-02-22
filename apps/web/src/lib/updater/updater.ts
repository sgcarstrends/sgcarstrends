import path from "node:path";
import { db, getTableName, inArray, type Table } from "@sgcarstrends/database";
import { createUniqueKey } from "@sgcarstrends/utils";
import { AWS_LAMBDA_TEMP_DIR } from "@web/config/workflow";
import { calculateChecksum } from "@web/lib/updater/services/calculate-checksum";
import { downloadFile } from "@web/lib/updater/services/download-file";
import {
  type CSVTransformOptions,
  processCsv,
} from "@web/lib/updater/services/process-csv";
import { Checksum } from "@web/utils/checksum";

export interface UpdaterConfig<T> {
  table: Table;
  url: string;
  csvFile?: string;
  partitionField?: string;
  keyFields: string[];
  csvTransformOptions?: CSVTransformOptions<T>;
}

export interface UpdaterResult {
  table: string;
  recordsProcessed: number;
  message: string;
  timestamp: string;
  checksum?: string;
}

export interface UpdaterOptions {
  batchSize?: number;
  checksum?: Checksum;
}

const DEFAULT_BATCH_SIZE = 5000;

export async function update<T>(
  config: UpdaterConfig<T>,
  options: UpdaterOptions = {},
): Promise<UpdaterResult> {
  const checksumService = options.checksum || new Checksum();
  const batchSize = options.batchSize || DEFAULT_BATCH_SIZE;
  const tableName = getTableName(config.table);
  const partitionField = config.partitionField ?? "month";

  const { url, csvFile, csvTransformOptions = {} } = config;

  // === Download and verify ===
  const extractedFileName = await downloadFile(url, csvFile);
  const destinationPath = path.join(AWS_LAMBDA_TEMP_DIR, extractedFileName);
  console.log("Destination path:", destinationPath);

  const checksum = await calculateChecksum(destinationPath);
  console.log("Checksum:", checksum);

  const cachedChecksum =
    await checksumService.getCachedChecksum(extractedFileName);
  console.log("Cached checksum:", cachedChecksum);

  if (!cachedChecksum) {
    console.log("No cached checksum found. This might be the first run.");
    await checksumService.cacheChecksum(extractedFileName, checksum);
  } else if (cachedChecksum === checksum) {
    console.log(
      `File has not changed since last update (Checksum: ${checksum})`,
    );
    return {
      table: tableName,
      recordsProcessed: 0,
      message: "File has not changed since last update",
      timestamp: new Date().toISOString(),
    };
  }

  await checksumService.cacheChecksum(extractedFileName, checksum);
  console.log("Checksum has been changed.");

  // === Process CSV ===
  const processedData = await processCsv<T>(
    destinationPath,
    csvTransformOptions,
  );

  // === Insert new records ===
  const { table, keyFields } = config;

  // biome-ignore lint/suspicious/noExplicitAny: Dynamic field access requires any type
  const tableColumns = table as any;

  // === Phase 1: Partition-Level Deduplication ===
  const incomingPartitions = new Set(
    processedData.map(
      (record) => (record as Record<string, unknown>)[partitionField] as string,
    ),
  );

  const existingPartitionsQuery = await db
    .selectDistinct({ [partitionField]: tableColumns[partitionField] })
    .from(table);
  const existingPartitions = new Set(
    existingPartitionsQuery.map(
      (record) => (record as Record<string, unknown>)[partitionField] as string,
    ),
  );

  const newPartitions = incomingPartitions.difference(existingPartitions);

  console.log(
    `Partition analysis (${partitionField}): ${incomingPartitions.size} incoming, ${existingPartitions.size} existing, ${newPartitions.size} new`,
  );

  const recordsFromNewPartitions: T[] = [];
  const recordsFromOverlappingPartitions: T[] = [];

  for (const record of processedData) {
    const partition = (record as Record<string, unknown>)[
      partitionField
    ] as string;
    if (newPartitions.has(partition)) {
      recordsFromNewPartitions.push(record);
    } else {
      recordsFromOverlappingPartitions.push(record);
    }
  }

  console.log(
    `Records: ${recordsFromNewPartitions.length} from new ${partitionField}s, ${recordsFromOverlappingPartitions.length} from overlapping ${partitionField}s`,
  );

  // === Phase 2: Key-Level Comparison (overlapping partitions only) ===
  let newRecordsFromOverlapping: T[] = [];

  if (recordsFromOverlappingPartitions.length > 0) {
    const overlappingPartitions =
      incomingPartitions.intersection(existingPartitions);

    const existingKeysQuery = await db
      .select(
        Object.fromEntries(
          keyFields.map((field) => [field, tableColumns[field]]),
        ),
      )
      .from(table)
      .where(inArray(tableColumns[partitionField], [...overlappingPartitions]));

    const existingKeys = new Set(
      existingKeysQuery.map((record) => createUniqueKey(record, keyFields)),
    );

    const incomingKeys = new Set(
      recordsFromOverlappingPartitions.map((record) =>
        createUniqueKey(record as Record<string, unknown>, keyFields),
      ),
    );

    if (incomingKeys.isSubsetOf(existingKeys)) {
      console.log(
        `Early exit: all records from overlapping ${partitionField}s already exist`,
      );
    } else {
      newRecordsFromOverlapping = recordsFromOverlappingPartitions.filter(
        (record) => {
          const identifier = createUniqueKey(
            record as Record<string, unknown>,
            keyFields,
          );
          return !existingKeys.has(identifier);
        },
      );
    }
  }

  const newRecords = [
    ...recordsFromNewPartitions,
    ...newRecordsFromOverlapping,
  ];

  if (newRecords.length === 0) {
    return {
      table: tableName,
      recordsProcessed: 0,
      message:
        "No new data to insert. The provided data matches the existing records.",
      timestamp: new Date().toISOString(),
    };
  }

  let totalInserted = 0;
  const start = performance.now();

  for (let i = 0; i < newRecords.length; i += batchSize) {
    const batch = newRecords.slice(i, i + batchSize);
    const inserted = await db.insert(table).values(batch).returning();
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
