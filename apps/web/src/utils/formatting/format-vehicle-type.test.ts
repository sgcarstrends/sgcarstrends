import { describe, expect, it, vi } from "vitest";
import {
  formatVehicleType,
  formatVehicleTypeSlug,
} from "./format-vehicle-type";

vi.mock("@web/constants", () => ({
  VEHICLE_TYPE_MAP: {
    MPV: "Multi-Purpose Vehicle",
    SUV: "Sports Utility Vehicle",
  },
}));

describe("formatVehicleType", () => {
  it("should return mapped vehicle type", () => {
    expect(formatVehicleType("MPV")).toBe("Multi-Purpose Vehicle");
    expect(formatVehicleType("SUV")).toBe("Sports Utility Vehicle");
  });

  it("should return original type when not in map", () => {
    expect(formatVehicleType("Unknown")).toBe("Unknown");
  });
});

describe("formatVehicleTypeSlug", () => {
  it("should return formatted vehicle type from slug", () => {
    expect(formatVehicleTypeSlug("hatchback")).toBe("Hatchback");
    expect(formatVehicleTypeSlug("sedan")).toBe("Sedan");
    expect(formatVehicleTypeSlug("multi-purpose-vehicle")).toBe("MPV");
    expect(formatVehicleTypeSlug("sports-utility-vehicle")).toBe("SUV");
  });

  it("should return original slug when not in map", () => {
    expect(formatVehicleTypeSlug("unknown-type")).toBe("unknown-type");
  });
});
