import React from "react";
import { render } from "@testing-library/react";
import { BetaChip, NewChip } from "./chips";

describe("BetaChip", () => {
  it("should render with default props", () => {
    const { getByText } = render(<BetaChip />);
    expect(getByText("Beta")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<BetaChip className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("NewChip", () => {
  it("should render with default props", () => {
    const { getByText } = render(<NewChip />);
    expect(getByText("New")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<NewChip className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
