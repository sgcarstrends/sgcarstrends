import { render, screen } from "@testing-library/react";
import { OtherMakesSection } from "./other-makes-section";

describe("OtherMakesSection", () => {
  const mockMakes = ["NISSAN", "MAZDA", "SUBARU"];

  it("should render correctly", () => {
    const { container } = render(<OtherMakesSection makes={mockMakes} />);
    expect(container).toMatchSnapshot();
  });

  it("renders section title", () => {
    render(<OtherMakesSection makes={mockMakes} />);
    expect(screen.getByText("Other Makes")).toBeVisible();
  });

  it("displays makes count", () => {
    render(<OtherMakesSection makes={mockMakes} />);
    expect(screen.getByText(mockMakes.length.toString())).toBeVisible();
  });

  it("renders make cards for each make", () => {
    render(<OtherMakesSection makes={mockMakes} />);
    mockMakes.forEach((make) => {
      expect(screen.getByText(make)).toBeVisible();
    });
  });

  it("does not render when makes array is empty", () => {
    const { container } = render(<OtherMakesSection makes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders explore buttons for each make", () => {
    render(<OtherMakesSection makes={mockMakes} />);
    const exploreButtons = screen.getAllByRole("button", { name: "Explore" });
    expect(exploreButtons).toHaveLength(mockMakes.length);
  });
});