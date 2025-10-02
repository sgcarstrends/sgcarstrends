import { render, screen } from "@testing-library/react";
import type { COEResult } from "@web/types";
import { LatestCOE } from "./latest-coe";

vi.mock("@web/components/animated-number", () => ({
  AnimatedNumber: ({ value }: { value: number }) => <span>{value}</span>,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("LatestCOE", () => {
  const mockResults: COEResult[] = [
    {
      month: "2024-01",
      bidding_no: 1,
      vehicle_class: "Category A",
      quota: 100,
      bids_success: 90,
      bids_received: 120,
      premium: 95000,
    },
    {
      month: "2024-01",
      bidding_no: 1,
      vehicle_class: "Category B",
      quota: 80,
      bids_success: 75,
      bids_received: 100,
      premium: 105000,
    },
  ];

  it("should render title and view all link", () => {
    render(<LatestCOE results={mockResults} />);

    expect(screen.getByText("Latest COE Results")).toBeInTheDocument();
    expect(screen.getByText("View all")).toBeInTheDocument();
  });

  it("should render all COE results", () => {
    render(<LatestCOE results={mockResults} />);

    expect(screen.getByText("Category A")).toBeInTheDocument();
    expect(screen.getByText("Category B")).toBeInTheDocument();
    expect(screen.getByText("95000")).toBeInTheDocument();
    expect(screen.getByText("105000")).toBeInTheDocument();
  });

  it("should render with empty results", () => {
    render(<LatestCOE results={[]} />);

    expect(screen.getByText("Latest COE Results")).toBeInTheDocument();
  });

  it("should have link to COE page", () => {
    render(<LatestCOE results={mockResults} />);

    const link = screen.getByText("View all").closest("a");
    expect(link).toHaveAttribute("href", "/coe");
  });
});
