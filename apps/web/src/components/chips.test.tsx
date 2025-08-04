import { render } from "@testing-library/react";
import { BetaChip, NewChip } from "./chips";

describe("BetaChip", () => {
  it("should render with default props", () => {
    const { getByText } = render(<BetaChip />);
    expect(getByText("Beta")).toBeInTheDocument();
  });
});

describe("NewChip", () => {
  it("should render with default props", () => {
    const { getByText } = render(<NewChip />);
    expect(getByText("New")).toBeInTheDocument();
  });
});
