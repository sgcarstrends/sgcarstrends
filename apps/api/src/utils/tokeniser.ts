export const tokeniser = (data: Record<string, unknown>[]): string => {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const headerLine = headers.join("|");

  const formattedData = data
    .map((item) => {
      const values = headers.map((header) => {
        const value = item[header];
        return value !== null && value !== undefined ? String(value) : "";
      });
      return values.join("|");
    })
    .join("\n");

  return `${headerLine}\n${formattedData}`;
};
