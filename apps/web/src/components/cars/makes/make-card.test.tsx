import { render, screen } from "@testing-library/react";
import { MakeCard } from "./make-card";

describe("MakeCard", () => {
  const germanMakes = ["AUDI", "BMW", "MERCEDES BENZ", "VOLKSWAGEN"];
  const mockMake = germanMakes[1];

  it("should render the make name", () => {
    render(<MakeCard make={mockMake} />);
    expect(screen.getByText(mockMake)).toBeVisible();
  });

  it("should render the logo with the correct alt text", () => {
    render(<MakeCard make={mockMake} />);
    expect(screen.getByRole("img", { name: `${mockMake} Logo` })).toBeVisible();
  });

  it("should show the popular badge when flagged", () => {
    render(<MakeCard make={mockMake} isPopular />);
    expect(screen.getByText("Popular")).toBeVisible();
  });

  it("should hide the badge when not flagged", () => {
    render(<MakeCard make={mockMake} />);
    expect(screen.queryByText("Popular")).not.toBeInTheDocument();
  });
});
