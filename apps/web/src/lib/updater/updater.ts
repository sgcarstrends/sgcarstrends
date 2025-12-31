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
import { getTableName, type Table } from "drizzle-orm";

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

      console.log(response);
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

    // Create a query to check for existing records
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic field access requires any type
    const tableColumns = table as any;
    const existingKeysQuery = await db
      .select(
        Object.fromEntries(
          keyFields.map((field) => [field, tableColumns[field]]),
        ),
      )
      .from(table);

    // Create a Set of existing keys for faster lookup
    const existingKeys = new Set(
      existingKeysQuery.map((record) => createUniqueKey(record, keyFields)),
    );

    // Check against the existing records for new non-duplicated entries
    const newRecords = processedData.filter((record) => {
      const identifier = createUniqueKey(
        record as Record<string, unknown>,
        keyFields,
      );
      return !existingKeys.has(identifier);
    });

    // Return early when there are no new records to be added to the database
    if (newRecords.length === 0) {
      return 0;
    }

    // Process in batches only if we have new records
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

    // Invalidate the cache when the table is updated
    // await db.$cache.invalidate({ tables: table });

    console.log(
      `Inserted ${totalInserted} record(s) in ${Math.round(end - start)}ms`,
    );

    return totalInserted;
  }
}
