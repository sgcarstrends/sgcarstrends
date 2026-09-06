import fs from "node:fs/promises";
import Papa, { type ParseConfig } from "papaparse";

export interface CSVTransformOptions<T> {
  /**
   * Per-column parsers keyed by the mapped (camelCase) column name. PapaParse
   * runs these before dynamic typing, so the raw value is always a string.
   */
  fields?: { [K in keyof T]?: (value: string) => T[K] };
  /** Maps CSV header names to row property names. */
  columnMapping?: Record<string, keyof T & string>;
  /**
   * PapaParse dynamic typing. Defaults to true. Disable for files where
   * numeric-looking strings must survive intact, such as postal codes with
   * leading zeros.
   */
  dynamicTyping?: boolean;
}

export async function processCsv<T>(
  filePath: string,
  options: CSVTransformOptions<T> = {},
) {
  // The whole file is read and parsed into an array of row objects. The
  // parsed rows dominate memory, not the download: the largest DataMall CSV
  // (cars by make, ~3.5 MB, ~61k rows) parses to ~13 MB of objects on a
  // ~250 KB archive. Well within function memory, and several workflow crons
  // share an instance at 10:00 under Fluid Compute. Switch to a streaming
  // parse before buffering here if a source grows by an order of magnitude.
  const fileContent = await fs.readFile(filePath, "utf-8");

  const {
    fields = {} as NonNullable<CSVTransformOptions<T>["fields"]>,
    columnMapping = {},
    dynamicTyping = true,
  } = options;

  const parseConfig: ParseConfig<T> = {
    header: true,
    dynamicTyping,
    skipEmptyLines: true,
    transformHeader: (header) => columnMapping[header] || header,
    transform: (value, field) => {
      const parser = fields[field as keyof T];

      if (parser) {
        return parser(value);
      }

      return typeof value === "string" ? value.trim() : value;
    },
  };

  const { data } = Papa.parse<T>(fileContent, parseConfig);

  return data;
}
