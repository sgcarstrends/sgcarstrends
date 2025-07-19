import { render, screen } from "@testing-library/react";
import { PopularMakesSection } from "./popular-makes-section";

describe("PopularMakesSection", () => {
  const mockMakes = ["TOYOTA", "HONDA", "BMW"];

  it("should render correctly", () => {
    const { container } = render(<PopularMakesSection makes={mockMakes} />);
    expect(container).toMatchSnapshot();
  });

  it("renders section title", () => {
    render(<PopularMakesSection makes={mockMakes} />);
    expect(screen.getByText("Popular Makes")).toBeVisible();
  });

  it("displays makes count", () => {
    render(<PopularMakesSection makes={mockMakes} />);
    expect(screen.getByText(mockMakes.length.toString())).toBeVisible();
  });

  it("renders make cards for each make", () => {
    render(<PopularMakesSection makes={mockMakes} />);
    mockMakes.forEach((make) => {
      expect(screen.getByText(make)).toBeVisible();
    });
  });

  it("does not render when makes array is empty", () => {
    const { container } = render(<PopularMakesSection makes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders explore buttons for each make", () => {
    render(<PopularMakesSection makes={mockMakes} />);
    const exploreButtons = screen.getAllByRole("button", { name: "Explore" });
    expect(exploreButtons).toHaveLength(mockMakes.length);
  });
});