import { render, screen, fireEvent } from "@testing-library/react";
import { MakesList } from "./makes-list";

describe("MakesList", () => {
  const mockMakes = [
    "TOYOTA",
    "HONDA",
    "BMW",
    "AUDI",
    "MERCEDES BENZ",
    "HYUNDAI",
    "KIA",
    "VOLKSWAGEN",
    "NISSAN",
    "MAZDA",
  ];

  it("should render correctly", () => {
    const { container } = render(<MakesList makes={mockMakes} />);
    expect(container).toMatchSnapshot();
  });

  it("renders search input", () => {
    render(<MakesList makes={mockMakes} />);
    const searchInput = screen.getByPlaceholderText("Search");
    expect(searchInput).toBeVisible();
  });

  it("displays makes count", () => {
    render(<MakesList makes={mockMakes} />);
    expect(screen.getByText(`${mockMakes.length} of ${mockMakes.length} makes`)).toBeVisible();
  });

  it("renders Popular Makes section by default", () => {
    render(<MakesList makes={mockMakes} />);
    expect(screen.getByText("Popular Makes")).toBeVisible();
  });

  it("renders Other Makes section by default", () => {
    render(<MakesList makes={mockMakes} />);
    expect(screen.getByText("Other Makes")).toBeVisible();
  });

  it("filters makes when searching", () => {
    render(<MakesList makes={mockMakes} />);
    
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "TOYOTA" } });
    
    expect(screen.getByText("1 of 10 makes")).toBeVisible();
  });

  it("shows no results message when no makes match search", () => {
    render(<MakesList makes={mockMakes} />);
    
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "NONEXISTENT" } });
    
    expect(screen.getByText('No makes found matching "NONEXISTENT"')).toBeVisible();
  });

  it("hides Popular and Other Makes sections when searching", () => {
    render(<MakesList makes={mockMakes} />);
    
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "TOYOTA" } });
    
    expect(screen.queryByText("Popular Makes")).not.toBeInTheDocument();
    expect(screen.queryByText("Other Makes")).not.toBeInTheDocument();
  });
});