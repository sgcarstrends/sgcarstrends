import { render, screen } from "@testing-library/react";
import { PopularMakesSection } from "./popular-makes-section";

describe("PopularMakesSection", () => {
  const germanMakes = ["AUDI", "BMW", "MERCEDES BENZ", "VOLKSWAGEN"];

  it("should render the section heading and count", () => {
    render(<PopularMakesSection makes={germanMakes} />);
    expect(screen.getByText("Popular Makes")).toBeVisible();
    expect(screen.getByText(germanMakes.length.toString())).toBeVisible();
  });

  it("should render a card for each popular make", () => {
    render(<PopularMakesSection makes={germanMakes} />);
    germanMakes.forEach((make) => {
      expect(screen.getByText(make)).toBeVisible();
    });
  });

  it("should highlight each card as popular", () => {
    render(<PopularMakesSection makes={germanMakes} />);
    expect(screen.getAllByText("Popular")).toHaveLength(germanMakes.length);
  });

  it("should render nothing when no popular makes exist", () => {
    const { container } = render(<PopularMakesSection makes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
