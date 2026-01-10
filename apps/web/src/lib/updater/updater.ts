import path from "node:path";
import { db } from "@sgcarstrends/database";
import { createUniqueKey } from "@sgcarstrends/utils";
import { AWS_LAMBDA_TEMP_DIR } from "@web/config/workflow";
import { calculateChecksum } from "@web/lib/updater/services/calculate-checksum";
import { downloadFile } from "@web/lib/updater/services/download-file";
import {
  type CSVTransformOptions,
  processCsv,
} from "@web/lib/updater/services/process-csv";
import { Checksum } from "@web/utils/checksum";
import { getTableName, inArray, type Table } from "drizzle-orm";

export interface UpdaterConfig<T> {
  table: Table;
  url: string;
  csvFile?: string;
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

export class Updater<T> {
  private readonly config: UpdaterConfig<T>;
  private readonly checksum: Checksum;
  private readonly batchSize: number;
  private readonly tableName: string;

  constructor(config: UpdaterConfig<T>, options: UpdaterOptions = {}) {
    this.config = config;
    this.checksum = options.checksum || new Checksum();
    this.batchSize = options.batchSize || DEFAULT_BATCH_SIZE;
    this.tableName = getTableName(config.table);
  }

  async update(): Promise<UpdaterResult> {
    try {
      const { filePath, checksum } = await this.downloadAndVerify();

      if (!checksum) {
        return {
          table: this.tableName,
          recordsProcessed: 0,
          message: `File has not changed since last update`,
          timestamp: new Date().toISOString(),
        };
      }

      const processedData = await this.processData(filePath);
      const totalInserted = await this.insertNewRecords(processedData);

      const response = {
        table: this.tableName,
        recordsProcessed: totalInserted,
        message:
          totalInserted > 0
            ? `${totalInserted} record(s) inserted`
            : "No new data to insert. The provided data matches the existing records.",
        timestamp: new Date().toISOString(),
      };

      return response;
    } catch (e) {
      console.error("Error in updater:", e);
      throw e;
    }
  }

  private async downloadAndVerify(): Promise<{
    filePath: string;
    checksum: string | null;
  }> {
    const { url, csvFile } = this.config;

    // Download and extract file
    const extractedFileName = await downloadFile(url, csvFile);
    const destinationPath = path.join(AWS_LAMBDA_TEMP_DIR, extractedFileName);
    console.log("Destination path:", destinationPath);

    // Calculate checksum of the downloaded file
    const checksum = await calculateChecksum(destinationPath);
    console.log("Checksum:", checksum);

    // Get previously stored checksum
    const cachedChecksum =
      await this.checksum.getCachedChecksum(extractedFileName);
    console.log("Cached checksum:", cachedChecksum);

    if (!cachedChecksum) {
      console.log("No cached checksum found. This might be the first run.");
      await this.checksum.cacheChecksum(extractedFileName, checksum);
    } else if (cachedChecksum === checksum) {
      const message = `File has not changed since last update (Checksum: ${checksum})`;
      console.log(message);
      return { filePath: destinationPath, checksum: null };
    }

    await this.checksum.cacheChecksum(extractedFileName, checksum);
    console.log("Checksum has been changed.");

    return { filePath: destinationPath, checksum };
  }

  private async processData(filePath: string): Promise<T[]> {
    const { csvTransformOptions = {} } = this.config;

    // Process CSV with custom transformations
    return await processCsv(filePath, csvTransformOptions);
  }

  private async insertNewRecords(processedData: T[]): Promise<number> {
    const { table, keyFields } = this.config;

    // biome-ignore lint/suspicious/noExplicitAny: Dynamic field access requires any type
    const tableColumns = table as any;

    // === Phase 1: Month-Level Partitioning ===
    // Extract distinct months from incoming data
    const incomingMonths = new Set(
      processedData.map(
        (record) => (record as Record<string, unknown>).month as string,
      ),
    );

    // Query distinct months from DB
    const existingMonthsQuery = await db
      .selectDistinct({ month: tableColumns.month })
      .from(table);
    const existingMonths = new Set(
      existingMonthsQuery.map((record) => record.month as string),
    );

    // Use Set.difference() to find brand new months (ES2025)
    const newMonths = incomingMonths.difference(existingMonths);

    console.log(
      `Month analysis: ${incomingMonths.size} incoming, ${existingMonths.size} existing, ${newMonths.size} new`,
    );

    // Separate records: new months skip key comparison entirely
    const recordsFromNewMonths: T[] = [];
    const recordsFromOverlappingMonths: T[] = [];

    for (const record of processedData) {
      const month = (record as Record<string, unknown>).month as string;
      if (newMonths.has(month)) {
        recordsFromNewMonths.push(record);
      } else {
        recordsFromOverlappingMonths.push(record);
      }
    }

    console.log(
      `Records: ${recordsFromNewMonths.length} from new months, ${recordsFromOverlappingMonths.length} from overlapping months`,
    );

    // === Phase 2: Key-Level Comparison (overlapping months only) ===
    let newRecordsFromOverlapping: T[] = [];

    if (recordsFromOverlappingMonths.length > 0) {
      // Use Set.intersection() to find overlapping months (ES2025)
      const overlappingMonths = incomingMonths.intersection(existingMonths);

      // Scoped database query: only fetch keys for overlapping months
      const existingKeysQuery = await db
        .select(
          Object.fromEntries(
            keyFields.map((field) => [field, tableColumns[field]]),
          ),
        )
        .from(table)
        .where(inArray(tableColumns.month, [...overlappingMonths]));

      const existingKeys = new Set(
        existingKeysQuery.map((record) => createUniqueKey(record, keyFields)),
      );

      // Create Set of incoming keys for overlapping months
      const incomingKeys = new Set(
        recordsFromOverlappingMonths.map((record) =>
          createUniqueKey(record as Record<string, unknown>, keyFields),
        ),
      );

      // Use Set.isSubsetOf() for early exit when all incoming keys already exist (ES2025)
      if (incomingKeys.isSubsetOf(existingKeys)) {
        console.log(
          "Early exit: all records from overlapping months already exist",
        );
      } else {
        // Filter remaining records with has()
        newRecordsFromOverlapping = recordsFromOverlappingMonths.filter(
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

    // Combine all new records
    const newRecords = [...recordsFromNewMonths, ...newRecordsFromOverlapping];

    // Return early when there are no new records to be added to the database
    if (newRecords.length === 0) {
      return 0;
    }

    // Process in batches
    let totalInserted = 0;
    const start = performance.now();

    for (let i = 0; i < newRecords.length; i += this.batchSize) {
      const batch = newRecords.slice(i, i + this.batchSize);
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

    return totalInserted;
  }
}
