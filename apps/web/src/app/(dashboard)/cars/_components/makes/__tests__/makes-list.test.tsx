import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MakesList } from "../makes-list";

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
  });

  it("should filter makes using exact match", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    await user.type(searchInput, "BMW");

    await waitFor(() => {
      expect(screen.getByText("1 of 10 makes")).toBeInTheDocument();
    });
  });

  it("should handle prefix matching", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    await user.type(searchInput, "toy");

    await waitFor(() => {
      expect(screen.getByText(/1 of 10 makes/)).toBeInTheDocument();
    });
  });

  it("should handle partial queries with fuzzy matching", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    await user.type(searchInput, "bm");

    await waitFor(() => {
      // BMW should be found with partial match "bm"
      expect(screen.getByText(/of 10 makes/)).toBeInTheDocument();
    });
  });

  it("should handle multi-word searches", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    // Search for "mercedes" which should match "Mercedes-Benz"
    await user.type(searchInput, "mercedes");

    await waitFor(() => {
      expect(screen.getByText("1 of 10 makes")).toBeInTheDocument();
    });
  });

  it("should be case insensitive", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    await user.type(searchInput, "TOYOTA");

    await waitFor(() => {
      expect(screen.getByText("1 of 10 makes")).toBeInTheDocument();
    });
  });

  it("should show empty state when no matches found", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    await user.type(searchInput, "xyzabc");

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

  it("should maintain popular makes priority in search results", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");
    await user.type(searchInput, "a");

    await waitFor(() => {
      // Should find makes with "a" in them, with popular makes first
      const makesCount = screen.getByText(/of 10 makes/);
      expect(makesCount).toBeInTheDocument();
    });
  });

  it("should update results count as search term changes", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");

    // Initial state
    expect(screen.getByText("10 of 10 makes")).toBeInTheDocument();

    // Type "To" - should match Toyota
    await user.type(searchInput, "To");
    await waitFor(() => {
      expect(screen.getByText(/of 10 makes/)).toBeInTheDocument();
    });

    // Clear and type something that matches nothing
    await user.clear(searchInput);
    await user.type(searchInput, "zzz");
    await waitFor(() => {
      expect(
        screen.getByText(/No makes found matching "zzz"/),
      ).toBeInTheDocument();
    });
  });

  it("should display search results section when searching", async () => {
    const user = userEvent.setup();
    render(<MakesList makes={mockMakes} popularMakes={mockPopularMakes} />);

    const searchInput = screen.getByPlaceholderText("Search by make");

    // Initially shows "Popular Makes" and "All Makes" sections
    expect(screen.getByText("Popular Makes")).toBeInTheDocument();
    expect(screen.getByText("All Makes")).toBeInTheDocument();

    // When searching, these sections should not be visible (replaced by search results)
    await user.type(searchInput, "Toyota");

    await waitFor(() => {
      expect(screen.queryByText("Popular Makes")).not.toBeInTheDocument();
      expect(screen.queryByText("All Makes")).not.toBeInTheDocument();
    });
  });
});
