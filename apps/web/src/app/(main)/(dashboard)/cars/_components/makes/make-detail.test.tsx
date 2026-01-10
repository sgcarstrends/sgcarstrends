import { render, screen } from "@testing-library/react";
import type { Car } from "@web/types";
import { MakeDetail } from "./make-detail";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <div className={className}>{children}</div>,
  },
}));

vi.mock("@web/app/(main)/(dashboard)/cars/_components/makes", () => ({
  MakeTrendChart: () => <div>TrendChart</div>,
  CoeComparisonChart: () => <div>CoeComparisonChart</div>,
}));

vi.mock("@sgcarstrends/ui/components/data-table", () => ({
  DataTable: () => <div>DataTable</div>,
}));

const mockCars = {
  make: "BMW",
  total: 100,
  data: [
    {
      month: "2024-01",
      make: "BMW",
      fuelType: "PETROL",
      vehicleType: "SALOON",
      number: 50,
    },
    {
      month: "2024-02",
      make: "BMW",
      fuelType: "HYBRID",
      vehicleType: "SUV",
      number: 30,
    },
  ] as unknown as Car[],
};

const mockCoeComparison = [
  {
    month: "2024-01",
    registrations: 50,
    categoryAPremium: 95000,
    categoryBPremium: 110000,
  },
  {
    month: "2024-02",
    registrations: 30,
    categoryAPremium: 98000,
    categoryBPremium: 115000,
  },
];

const mockLogo = {
  make: "BMW",
  brand: "BMW",
  url: "https://example.com/bmw.png",
  filename: "bmw.png",
};

describe("MakeDetail", () => {
  it("should render metric cards", () => {
    render(<MakeDetail cars={mockCars} coeComparison={mockCoeComparison} />);
    expect(screen.getByText("100")).toBeVisible();
    expect(screen.getByText("Total")).toBeVisible();
    expect(screen.getByText("50")).toBeVisible();
    expect(screen.getByText("This Month")).toBeVisible();
    expect(screen.getByText("2")).toBeVisible();
    expect(screen.getByText("Tracked")).toBeVisible();
  });

  it("should render Historical Trend card", () => {
    render(<MakeDetail cars={mockCars} coeComparison={mockCoeComparison} />);
    expect(screen.getByText("Historical Trend")).toBeVisible();
    expect(screen.getByText("Past registrations")).toBeVisible();
  });

  it("should render Registration vs COE Premium card", () => {
    render(<MakeDetail cars={mockCars} coeComparison={mockCoeComparison} />);
    expect(screen.getByText("Registration vs COE Premium")).toBeVisible();
  });

  it("should render Summary card", () => {
    render(<MakeDetail cars={mockCars} coeComparison={mockCoeComparison} />);
    expect(screen.getByText("Summary")).toBeVisible();
    expect(screen.getByText("Fuel & vehicle types by month")).toBeVisible();
  });

  it("should render EmptyState component when cars is null", () => {
    render(<MakeDetail cars={null} coeComparison={mockCoeComparison} />);
    expect(screen.getByText("No Data Available")).toBeVisible();
  });

  describe("header display", () => {
    it("should render make name in header", () => {
      render(<MakeDetail cars={mockCars} coeComparison={mockCoeComparison} />);
      expect(screen.getByText("BMW")).toBeVisible();
      expect(screen.getByText("Vehicle Registrations")).toBeVisible();
    });

    it("should render logo image when logo is provided", () => {
      render(
        <MakeDetail
          cars={mockCars}
          coeComparison={mockCoeComparison}
          logo={mockLogo}
        />,
      );

      const image = screen.getByAltText("BMW logo");
      expect(image).toBeVisible();
      expect(image).toHaveAttribute("src", expect.stringContaining("bmw.png"));
    });

    it("should render avatar fallback when logo is not provided", () => {
      render(<MakeDetail cars={mockCars} coeComparison={mockCoeComparison} />);
      expect(screen.getByText("B")).toBeVisible();
    });

    it("should always render header with make information", () => {
      render(
        <MakeDetail
          cars={mockCars}
          coeComparison={mockCoeComparison}
          logo={mockLogo}
        />,
      );
      // Header is always visible now (no showHeader prop)
      expect(screen.getByAltText("BMW logo")).toBeInTheDocument();
      expect(screen.getByText("BMW")).toBeVisible();
    });
  });
});
