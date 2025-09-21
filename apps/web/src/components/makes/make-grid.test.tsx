import { render, screen } from "@testing-library/react";
import { MakeGrid } from "./make-grid";

describe("MakeGrid", () => {
  const germanMakes = ["AUDI", "BMW", "MERCEDES BENZ", "VOLKSWAGEN"];

  it("should render all makes in grid layout", () => {
    render(<MakeGrid makes={germanMakes} />);
    germanMakes.forEach((make) => {
      expect(screen.getByText(make)).toBeVisible();
    });
  });

  it("should show popular badges when isPopular is true", () => {
    render(<MakeGrid makes={germanMakes} isPopular={true} />);
    expect(screen.getAllByText("Popular")).toHaveLength(germanMakes.length);
  });

  it("should not show popular badges when isPopular is false", () => {
    render(<MakeGrid makes={germanMakes} isPopular={false} />);
    expect(screen.queryByText("Popular")).not.toBeInTheDocument();
  });

  it("should not show popular badges by default", () => {
    render(<MakeGrid makes={germanMakes} />);
    expect(screen.queryByText("Popular")).not.toBeInTheDocument();
  });

  it("should render nothing when no makes exist", () => {
    const { container } = render(<MakeGrid makes={[]} />);
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it("should apply grid layout classes", () => {
    const { container } = render(<MakeGrid makes={germanMakes} />);
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass(
      "grid",
      "grid-cols-2",
      "gap-4",
      "md:grid-cols-8",
    );
  });
});
