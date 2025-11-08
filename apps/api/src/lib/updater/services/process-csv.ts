import fs from "node:fs";
import Papa from "papaparse";

export interface CSVTransformOptions<T> {
  fields?: { [K in keyof T]?: unknown };
  columnMapping?: Record<string, string>;
}

export const processCsv = async <T>(
  filePath: string,
  options: CSVTransformOptions<T> = {},
) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { fields = {}, columnMapping = {} } = options;

  const { data } = Papa.parse<T>(fileContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transform: (value, field) => {
      // Check for specific field transformations
      if (fields[field]) {
        return fields[field](value);
      }

      // Default trim
      return typeof value === "string" ? value.trim() : value;
    },
  });

  // Apply column name mapping if provided
  if (Object.keys(columnMapping).length > 0) {
    return data.map((row) => {
      const mappedRow: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(row)) {
        const mappedKey = columnMapping[key] || key;
        mappedRow[mappedKey] = value;
      }
      return mappedRow as T;
    });
  }

  return data;
};
