import { normaliseMake } from "@logos/utils/normalise-make";
import { describe, expect, it } from "vitest";

describe("normaliseMake", () => {
  it.each([
    // Basic makes
    { input: "BMW", expected: "bmw" },
    { input: "Mercedes-Benz", expected: "mercedes-benz" },
    { input: "Audi", expected: "audi" },

    // Names with spaces
    { input: "Land Rover", expected: "land-rover" },
    { input: "Rolls Royce", expected: "rolls-royce" },
    { input: "Aston Martin", expected: "aston-martin" },

    // Logo suffixes
    { input: "BMW-logo", expected: "bmw" },
    { input: "Audi-logo.png", expected: "audi" },
    { input: "Mercedes-logo-vector", expected: "mercedes" },

    // Logo prefixes
    { input: "logo-BMW", expected: "bmw" },
    { input: "logo-Mercedes", expected: "mercedes" },

    // Special characters
    { input: "Citroën", expected: "citroen" },
    { input: "Škoda", expected: "skoda" },
    { input: "McLaren", expected: "mc-laren" },

    // Empty and whitespace
    { input: "", expected: "" },
    { input: "   ", expected: "" },
    { input: "\t\n", expected: "" },

    // Numbers and mixed case
    { input: "BMW M3", expected: "bmw-m3" },
    { input: "FORD F150", expected: "ford-f150" },
  ])("should normalise $description", ({ input, expected }) => {
    expect(normaliseMake(input)).toBe(expected);
  });
});
