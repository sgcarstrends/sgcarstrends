import { render, screen } from "@testing-library/react";
import { MakeCard } from "./make-card";

describe("MakeCard", () => {
  const mockMake = "TOYOTA";

  it("should render correctly", () => {
    const { container } = render(<MakeCard make={mockMake} />);
    expect(container).toMatchSnapshot();
  });

  it("renders the make name", () => {
    render(<MakeCard make={mockMake} />);
    expect(screen.getByText(mockMake)).toBeVisible();
  });

  it("renders the Explore button", () => {
    render(<MakeCard make={mockMake} />);
    const exploreButton = screen.getByRole("button", { name: "Explore" });
    expect(exploreButton).toBeVisible();
  });

  it("renders correct link for make", () => {
    render(<MakeCard make={mockMake} />);
    const exploreButton = screen.getByRole("button", { name: "Explore" });
    expect(exploreButton.closest("a")).toHaveAttribute("href", "/cars/makes/toyota");
  });

  it("applies popular styling when isPopular is true", () => {
    const { container } = render(<MakeCard make={mockMake} isPopular={true} />);
    expect(container.querySelector(".ring-primary-200")).toBeInTheDocument();
  });

  it("does not apply popular styling when isPopular is false", () => {
    const { container } = render(<MakeCard make={mockMake} isPopular={false} />);
    expect(container.querySelector(".ring-primary-200")).not.toBeInTheDocument();
  });

  it("renders image with correct alt text", () => {
    render(<MakeCard make={mockMake} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "TOYOTA Logo");
  });
});