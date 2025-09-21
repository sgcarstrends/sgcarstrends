import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { AllMakesSection } from "./all-makes-section";

describe("AllMakesSection", () => {
  const germanMakes = ["AUDI", "BMW", "MERCEDES BENZ", "PORSCHE"];

  it("should render the section heading and count", () => {
    render(<AllMakesSection makes={germanMakes} />);
    expect(screen.getByText("All Makes")).toBeVisible();
    expect(screen.getByText(germanMakes.length.toString())).toBeVisible();
  });

  it("should default to the All tab", () => {
    render(<AllMakesSection makes={germanMakes} />);
    const badge = screen.getByTestId("makes-letter-badge");
    const grid = screen.getByTestId("makes-letter-grid");

    expect(badge).toHaveTextContent("ALL");
    germanMakes.forEach((make) => {
      expect(within(grid).getByText(make)).toBeVisible();
    });
  });

  it("should render an alphabetical tabs rail", () => {
    render(<AllMakesSection makes={germanMakes} />);
    expect(
      screen.getByRole("tablist", { name: "Makes A to Z filter" }),
    ).toBeVisible();
    expect(screen.getByRole("tab", { name: "ALL" })).toBeVisible();
  });

  it("should filter makes when selecting a specific letter", async () => {
    render(<AllMakesSection makes={germanMakes} />);
    const grid = screen.getByTestId("makes-letter-grid");

    fireEvent.click(screen.getByRole("tab", { name: "B" }));

    await waitFor(() => {
      expect(screen.getByTestId("makes-letter-badge")).toHaveTextContent("B");
    });

    await waitFor(() => {
      expect(within(grid).getByText("BMW")).toBeVisible();
    });

    expect(within(grid).queryByText("AUDI")).not.toBeInTheDocument();
  });

  it("should render nothing when there are no makes", () => {
    const { container } = render(<AllMakesSection makes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
