import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MakesList } from "./makes-list";

describe("MakesList", () => {
  const mockMakes = [
    "Toyota",
    "BMW",
    "Mercedes-Benz",
    "Honda",
    "Audi",
    "Volkswagen",
    "Lexus",
    "Nissan",
    "Mazda",
    "Hyundai",
  ];

  const mockPopularMakes = ["Toyota", "BMW", "Mercedes-Benz", "Honda"];

  it("should render all makes when no search term is provided", () => {
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    expect(screen.getByText("10 of 10 makes")).toBeInTheDocument();
    expect(screen.getByText("Popular Makes")).toBeInTheDocument();
    expect(screen.getByText("All Makes")).toBeInTheDocument();
  });

  it("should filter and display search results", async () => {
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    await userEvent.type(searchInput, "BMW");

    await waitFor(() => {
      expect(screen.getByText("1 of 10 makes")).toBeInTheDocument();
      expect(screen.queryByText("Popular Makes")).not.toBeInTheDocument();
      expect(screen.queryByText("All Makes")).not.toBeInTheDocument();
    });
  });

  it("should show empty state when no matches found", async () => {
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    await userEvent.type(searchInput, "xyzabc");

    await waitFor(() => {
      expect(
        screen.getByText(/No makes found matching "xyzabc"/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Try adjusting your search term or browse all available makes/,
        ),
      ).toBeInTheDocument();
    });
  });
});
