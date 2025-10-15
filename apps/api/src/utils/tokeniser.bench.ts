import { bench, describe } from "vitest";
import { tokeniser } from "./tokeniser";

const generateCarData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    month: `2024-${String((index % 12) + 1).padStart(2, "0")}`,
    make: `Make${index % 10}`,
    fuelType: index % 2 === 0 ? "Petrol" : "Diesel",
    number: Math.floor(Math.random() * 1000),
  }));
};

describe("tokeniser", () => {
  bench("tokenise 10 records", () => {
    const data = generateCarData(10);
    tokeniser(data);
  });

  bench("tokenise 50 records", () => {
    const data = generateCarData(50);
    tokeniser(data);
  });

  bench("tokenise 100 records", () => {
    const data = generateCarData(100);
    tokeniser(data);
  });

  bench("tokenise 500 records", () => {
    const data = generateCarData(500);
    tokeniser(data);
  });

  bench("tokenise 1000 records", () => {
    const data = generateCarData(1000);
    tokeniser(data);
  });

  bench("tokenise empty array", () => {
    tokeniser([]);
  });
});
