import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Makes } from "./makes";

vi.mock("nuqs", () => ({
  useQueryState: () => [null, vi.fn()],
}));

vi.mock("nuqs/server", () => ({
  parseAsString: {},
  createSerializer: () => (path: string) => path,
  createLoader: () => vi.fn(),
}));

describe("Makes", () => {
  const germanMakes = ["AUDI", "BMW", "MERCEDES BENZ", "PORSCHE"];

  it("should render the section with title and count", () => {
    render(<Makes title="Test Makes" makes={germanMakes} />);
    expect(screen.getByText("Test Makes")).toBeVisible();
    expect(screen.getByText(germanMakes.length.toString())).toBeVisible();
  });

  it("should render all makes in grid without letter filter", () => {
    render(<Makes title="Test Makes" makes={germanMakes} />);
    germanMakes.forEach((make) => {
      expect(screen.getByText(make)).toBeVisible();
    });
  });

  it("should render nothing when no makes exist", () => {
    const { container } = render(<Makes title="Test Makes" makes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  describe("Popular Makes", () => {
    it("should render popular makes section with badges", () => {
      render(
        <Makes title="Popular Makes" makes={germanMakes} isPopular={true} />,
      );
      expect(screen.getByText("Popular Makes")).toBeVisible();
      expect(screen.getByText(germanMakes.length.toString())).toBeVisible();
      germanMakes.forEach((make) => {
        expect(screen.getByText(make)).toBeVisible();
      });
      expect(screen.getAllByText("Popular")).toHaveLength(germanMakes.length);
    });

    it("should not show popular badges by default", () => {
      render(<Makes title="Regular Makes" makes={germanMakes} />);
      expect(screen.queryByText("Popular")).not.toBeInTheDocument();
    });
  });

  describe("All Makes", () => {
    it("should render all makes section with letter filter", () => {
      render(
        <Makes title="All Makes" makes={germanMakes} showLetterFilter={true} />,
      );
      expect(screen.getByText("All Makes")).toBeVisible();
      expect(screen.getByText(germanMakes.length.toString())).toBeVisible();
      expect(
        screen.getByRole("tablist", { name: "Makes A to Z filter" }),
      ).toBeVisible();
      expect(screen.getByRole("tab", { name: "ALL" })).toBeVisible();
    });

    it("should default to the All tab", () => {
      render(
        <Makes title="All Makes" makes={germanMakes} showLetterFilter={true} />,
      );
      expect(screen.getByRole("tab", { name: "ALL" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      germanMakes.forEach((make) => {
        expect(screen.getByText(make)).toBeVisible();
      });
    });

    it("should filter makes when selecting a specific letter", async () => {
      render(
        <Makes title="All Makes" makes={germanMakes} showLetterFilter={true} />,
      );

      fireEvent.click(screen.getByRole("tab", { name: "B" }));

      await waitFor(() => {
        expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute(
          "aria-selected",
          "true",
        );
      });

      await waitFor(() => {
        expect(screen.getByText("BMW")).toBeVisible();
      });

      expect(screen.queryByText("AUDI")).not.toBeInTheDocument();
    });
  });

  it("should show Other for # letter category", async () => {
    const mixedMakes = ["AUDI", "123MOTORS"];
    render(
      <Makes title="All Makes" makes={mixedMakes} showLetterFilter={true} />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "#" }));

    await waitFor(() => {
      expect(screen.getByText("Other")).toBeVisible();
    });

    await waitFor(() => {
      expect(screen.getByText("123MOTORS")).toBeVisible();
    });
  });
});
