import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AllMakes } from "./all-makes";

describe("Makes", () => {
  const germanMakes = ["AUDI", "BMW", "MERCEDES BENZ", "PORSCHE"];

  it("should render the section with title and count", () => {
    render(<AllMakes title="Test Makes" makes={germanMakes} />);
    expect(screen.getByText("Test Makes")).toBeVisible();
    expect(screen.getByText(germanMakes.length.toString())).toBeVisible();
  });

  it("should render all makes in grid without letter filter", () => {
    render(<AllMakes title="Test Makes" makes={germanMakes} />);
    germanMakes.forEach((make) => {
      expect(screen.getByText(make)).toBeVisible();
    });
  });

  it("should render nothing when no makes exist", () => {
    const { container } = render(<AllMakes title="Test Makes" makes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  describe("All Makes", () => {
    it("should render all makes section with letter filter", () => {
      render(
        <AllMakes
          title="All Makes"
          makes={germanMakes}
          showLetterFilter={true}
        />,
      );
      expect(screen.getByText("All Makes")).toBeVisible();
      expect(screen.getByText(germanMakes.length.toString())).toBeVisible();
      // Letter filter buttons are now custom buttons
      expect(screen.getByRole("button", { name: "ALL" })).toBeVisible();
    });

    it("should default to the All tab", () => {
      render(
        <AllMakes
          title="All Makes"
          makes={germanMakes}
          showLetterFilter={true}
        />,
      );
      // The ALL button should have primary styling (visual indicator)
      const allButton = screen.getByRole("button", { name: "ALL" });
      expect(allButton).toHaveClass("bg-primary");
      germanMakes.forEach((make) => {
        expect(screen.getByText(make)).toBeVisible();
      });
    });

    it("should filter makes when selecting a specific letter", async () => {
      render(
        <AllMakes
          title="All Makes"
          makes={germanMakes}
          showLetterFilter={true}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "B" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "B" })).toHaveClass(
          "bg-primary",
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
      <AllMakes title="All Makes" makes={mixedMakes} showLetterFilter={true} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "#" }));

    await waitFor(() => {
      expect(screen.getByText("Other")).toBeVisible();
    });

    await waitFor(() => {
      expect(screen.getByText("123MOTORS")).toBeVisible();
    });
  });
});
