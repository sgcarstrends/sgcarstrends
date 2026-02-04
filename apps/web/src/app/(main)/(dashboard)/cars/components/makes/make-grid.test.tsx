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
});
