import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { type Car, type Make } from "@/types";
import { CarMakeContent } from "./car-make-content";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("@/app/cars/makes/[make]/trend-chart", () => ({
  TrendChart: () => <div>TrendChart</div>,
}));

vi.mock("@/components/make-selector", () => ({
  MakeSelector: () => <div>MakeSelector</div>,
}));

vi.mock("@/components/ui/data-table", () => ({
  DataTable: () => <div>DataTable</div>,
}));

vi.mock("@/components/unreleased-feature", () => ({
  UnreleasedFeature: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockCars = {
  make: "TOYOTA",
  total: 100,
  data: [
    {
      month: "2024-01",
      make: "TOYOTA",
      fuelType: "PETROL",
      vehicleType: "SALOON",
      number: 50,
    },
    {
      month: "2024-02",
      make: "TOYOTA",
      fuelType: "HYBRID",
      vehicleType: "SUV",
      number: 30,
    },
  ] as unknown as Car[],
};

const mockMakes: Make[] = ["TOYOTA", "HONDA", "BMW"];

const mockLastUpdated = 1735660800; // 2025-01-01 00:00:00 UTC

describe("CarMakeContent", () => {
  it("renders make name", () => {
    render(<CarMakeContent make="TOYOTA" cars={mockCars} makes={mockMakes} />);
    expect(screen.getByText("TOYOTA")).toBeVisible();
  });

  it("renders Historical Trend card", () => {
    render(<CarMakeContent make="TOYOTA" cars={mockCars} makes={mockMakes} />);
    expect(screen.getByText("Historical Trend")).toBeVisible();
    expect(screen.getByText("Past registrations")).toBeVisible();
  });

  it("renders Summary card", () => {
    render(<CarMakeContent make="TOYOTA" cars={mockCars} makes={mockMakes} />);
    expect(screen.getByText("Summary")).toBeVisible();
    expect(
      screen.getByText("Breakdown of fuel & vehicle types by month"),
    ).toBeVisible();
  });

  it("renders NoData component when cars is null", () => {
    render(
      <CarMakeContent make="TOYOTA" cars={null as any} makes={mockMakes} />,
    );
    expect(screen.getByText("No Data Available")).toBeVisible();
  });

  it("renders LastUpdated component when lastUpdated is provided", () => {
    render(
      <CarMakeContent
        make="TOYOTA"
        cars={mockCars}
        makes={mockMakes}
        lastUpdated={mockLastUpdated}
      />,
    );
    expect(screen.getByText(/Last updated:/)).toBeVisible();
  });

  it("renders make logo image", () => {
    render(<CarMakeContent make="TOYOTA" cars={mockCars} makes={mockMakes} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Logo");
    expect(image).toHaveAttribute("src", expect.stringContaining("TOYOTA.png"));
  });
});
