import { describe, expect, it } from "vitest";
import { normaliseBrandName } from "@/logos/utils/normalisation";

describe("normaliseBrandName", () => {
  it("should normalise basic brand names", () => {
    expect(normaliseBrandName("BMW")).toBe("bmw");
    expect(normaliseBrandName("Mercedes-Benz")).toBe("mercedes-benz");
    expect(normaliseBrandName("Audi")).toBe("audi");
  });

  it("should handle names with spaces", () => {
    expect(normaliseBrandName("Land Rover")).toBe("land-rover");
    expect(normaliseBrandName("Rolls Royce")).toBe("rolls-royce");
    expect(normaliseBrandName("Aston Martin")).toBe("aston-martin");
  });

  it("should remove logo suffixes", () => {
    expect(normaliseBrandName("BMW-logo")).toBe("bmw");
    expect(normaliseBrandName("Audi-logo.png")).toBe("audi");
    expect(normaliseBrandName("Mercedes-logo-vector")).toBe("mercedes");
  });

  it("should remove logo prefixes", () => {
    expect(normaliseBrandName("logo-BMW")).toBe("bmw");
    expect(normaliseBrandName("logo-Mercedes")).toBe("mercedes");
  });

  it("should handle special characters", () => {
    expect(normaliseBrandName("Citroën")).toBe("citroen");
    expect(normaliseBrandName("Škoda")).toBe("skoda");
    expect(normaliseBrandName("McLaren")).toBe("mc-laren");
  });

  it("should handle empty and whitespace strings", () => {
    expect(normaliseBrandName("")).toBe("");
    expect(normaliseBrandName("   ")).toBe("");
    expect(normaliseBrandName("\t\n")).toBe("");
  });

  it("should handle numbers and mixed case", () => {
    expect(normaliseBrandName("BMW M3")).toBe("bmw-m3");
    expect(normaliseBrandName("FORD F150")).toBe("ford-f150");
  });
});
