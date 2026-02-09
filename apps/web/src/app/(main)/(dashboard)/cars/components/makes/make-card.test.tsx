import { render, screen } from "@testing-library/react";
import { MakeCard } from "./make-card";

describe("MakeCard", () => {
  const germanMakes = ["AUDI", "BMW", "MERCEDES BENZ", "VOLKSWAGEN"];
  const mockMake = germanMakes[1];
  const mockLogoUrl = "https://blob.vercel-storage.com/logos/bmw.png";

  it("should render the make name", () => {
    render(<MakeCard make={mockMake} logoUrl={mockLogoUrl} />);
    expect(screen.getByText(mockMake)).toBeVisible();
  });

  it("should render the logo with the correct alt text when logoUrl is provided", () => {
    render(<MakeCard make={mockMake} logoUrl={mockLogoUrl} />);
    expect(screen.getByRole("img", { name: `${mockMake} logo` })).toBeVisible();
  });

  it("should not render the logo when logoUrl is not provided", () => {
    render(<MakeCard make={mockMake} />);
    expect(
      screen.queryByRole("img", { name: `${mockMake} logo` }),
    ).not.toBeInTheDocument();
  });
});
