import { render, screen } from "@testing-library/react";
import type { Car, Make } from "@web/types";
import type { ReactNode } from "react";
import { MakeDetail } from "./make-detail";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("@web/components/makes", () => ({
  MakeTrendChart: () => <div>TrendChart</div>,
}));

vi.mock("@web/components/make-selector", () => ({
  MakeSelector: () => <div>MakeSelector</div>,
}));

vi.mock("@sgcarstrends/ui/components/data-table", () => ({
  DataTable: () => <div>DataTable</div>,
}));

vi.mock("@web/components/unreleased-feature", () => ({
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

describe("MakeDetail", () => {
  it("renders make name", () => {
    render(<MakeDetail make="TOYOTA" cars={mockCars} makes={mockMakes} />);
    expect(screen.getByText("TOYOTA")).toBeVisible();
  });

  it("renders Historical Trend card", () => {
    render(<MakeDetail make="TOYOTA" cars={mockCars} makes={mockMakes} />);
    expect(screen.getByText("Historical Trend")).toBeVisible();
    expect(screen.getByText("Past registrations")).toBeVisible();
  });

  it("renders Summary card", () => {
    render(<MakeDetail make="TOYOTA" cars={mockCars} makes={mockMakes} />);
    expect(screen.getByText("Summary")).toBeVisible();
    expect(
      screen.getByText("Breakdown of fuel & vehicle types by month"),
    ).toBeVisible();
  });

  it("renders NoData component when cars is null", () => {
    render(<MakeDetail make="TOYOTA" cars={null as any} makes={mockMakes} />);
    expect(screen.getByText("No Data Available")).toBeVisible();
  });

  it("renders LastUpdated component when lastUpdated is provided", () => {
    render(
      <MakeDetail
        make="TOYOTA"
        cars={mockCars}
        makes={mockMakes}
        lastUpdated={mockLastUpdated}
      />,
    );
    expect(screen.getByText(/Last updated:/)).toBeVisible();
  });

  it("should render logo image when logo is provided", () => {
    const mockLogo = {
      brand: "TOYOTA",
      url: "https://example.com/toyota.png",
      filename: "toyota.png",
    };

    render(
      <MakeDetail
        make="TOYOTA"
        cars={mockCars}
        makes={mockMakes}
        logo={mockLogo}
      />,
    );

    const image = screen.getByAltText("TOYOTA logo");
    expect(image).toBeVisible();
    expect(image).toHaveAttribute("src", expect.stringContaining("toyota.png"));
  });

  it("should render placeholder when logo is not provided", () => {
    render(<MakeDetail make="TOYOTA" cars={mockCars} makes={mockMakes} />);
  });

  it("should render placeholder when logo download fails", () => {
    render(
      <MakeDetail
        make="TOYOTA"
        cars={mockCars}
        makes={mockMakes}
        logo={undefined}
      />,
    );
  });
});
