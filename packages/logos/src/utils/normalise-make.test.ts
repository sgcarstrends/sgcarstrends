import { normaliseMake } from "@logos/utils/normalise-make.ts";
import { describe, expect, it } from "vitest";

describe("normaliseMake", () => {
  it("should normalise basic makes", () => {
    expect(normaliseMake("BMW")).toBe("bmw");
    expect(normaliseMake("Mercedes-Benz")).toBe("mercedes-benz");
    expect(normaliseMake("Audi")).toBe("audi");
  });

  it("should handle names with spaces", () => {
    expect(normaliseMake("Land Rover")).toBe("land-rover");
    expect(normaliseMake("Rolls Royce")).toBe("rolls-royce");
    expect(normaliseMake("Aston Martin")).toBe("aston-martin");
  });

  it("should remove logo suffixes", () => {
    expect(normaliseMake("BMW-logo")).toBe("bmw");
    expect(normaliseMake("Audi-logo.png")).toBe("audi");
    expect(normaliseMake("Mercedes-logo-vector")).toBe("mercedes");
  });

  it("should remove logo prefixes", () => {
    expect(normaliseMake("logo-BMW")).toBe("bmw");
    expect(normaliseMake("logo-Mercedes")).toBe("mercedes");
  });

  it("should handle special characters", () => {
    expect(normaliseMake("Citroën")).toBe("citroen");
    expect(normaliseMake("Škoda")).toBe("skoda");
    expect(normaliseMake("McLaren")).toBe("mc-laren");
  });

  it("should handle empty and whitespace strings", () => {
    expect(normaliseMake("")).toBe("");
    expect(normaliseMake("   ")).toBe("");
    expect(normaliseMake("\t\n")).toBe("");
  });

  it("should handle numbers and mixed case", () => {
    expect(normaliseMake("BMW M3")).toBe("bmw-m3");
    expect(normaliseMake("FORD F150")).toBe("ford-f150");
  });
});
