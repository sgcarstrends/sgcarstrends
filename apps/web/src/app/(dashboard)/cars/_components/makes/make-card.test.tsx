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
    expect(screen.getByRole("img", { name: `${mockMake} Logo` })).toBeVisible();
  });

  it("should not render the logo when logoUrl is not provided", () => {
    render(<MakeCard make={mockMake} />);
    expect(
      screen.queryByRole("img", { name: `${mockMake} Logo` }),
    ).not.toBeInTheDocument();
  });

  it("should show the popular badge when flagged", () => {
    render(<MakeCard make={mockMake} isPopular logoUrl={mockLogoUrl} />);
    expect(screen.getByText("Popular")).toBeVisible();
  });

  it("should hide the badge when not flagged", () => {
    render(<MakeCard make={mockMake} logoUrl={mockLogoUrl} />);
    expect(screen.queryByText("Popular")).not.toBeInTheDocument();
  });
});
