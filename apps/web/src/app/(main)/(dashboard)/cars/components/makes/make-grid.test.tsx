import { render, screen } from "@testing-library/react";
import { MakeGrid } from "./make-grid";

vi.mock("nuqs", () => ({
  useQueryState: () => [null, vi.fn()],
}));

vi.mock("nuqs/server", () => ({
  parseAsString: {},
  createSerializer: () => (path: string) => path,
  createLoader: () => vi.fn(),
}));

describe("MakeGrid", () => {
  const germanMakes = ["AUDI", "BMW", "MERCEDES BENZ", "VOLKSWAGEN"];

  it("should render all makes in grid layout", () => {
    render(<MakeGrid makes={germanMakes} />);
    germanMakes.forEach((make) => {
      expect(screen.getByText(make)).toBeVisible();
    });
  });

  it("should render nothing when no makes exist", () => {
    render(<MakeGrid makes={[]} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("should pass stats to MakeCard when makeStatsMap is provided", () => {
    const makeStatsMap = {
      BMW: {
        count: 1234,
        share: 12.5,
        trend: [{ value: 100 }, { value: 120 }],
      },
    };
    render(<MakeGrid makes={germanMakes} makeStatsMap={makeStatsMap} />);
    expect(screen.getByText("1,234 regs")).toBeVisible();
    expect(screen.getByText("12.5% share")).toBeVisible();
  });

  it("should render without stats when makeStatsMap is not provided", () => {
    render(<MakeGrid makes={germanMakes} />);
    expect(screen.queryByText(/regs/)).not.toBeInTheDocument();
  });
});
