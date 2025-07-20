import { render, screen } from "@testing-library/react";
import { StatCard } from "./stat-card";
import type { RegistrationStat } from "@/types/cars";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/app/cars/bar-chart-by-type", () => ({
  BarChartByType: ({ data }: { data: RegistrationStat[] }) => (
    <div data-testid="bar-chart">
      {data.map((item) => (
        <div key={item.name}>
          {item.name}: {item.count}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/config", () => ({
  FUEL_TYPE: {
    OTHERS: "Others",
  },
}));

describe("StatCard", () => {
  const mockData: RegistrationStat[] = [
    { name: "Petrol", count: 1000 },
    { name: "Electric", count: 500 },
  ];

  const defaultProps = {
    title: "Test Title",
    description: "Test Description",
    data: mockData,
    total: 1500,
  };

  it("should render with required props", () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("should render with empty data", () => {
    render(<StatCard {...defaultProps} data={[]} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render with linkPrefix prop", () => {
    render(<StatCard {...defaultProps} linkPrefix="makes" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
