import { render } from "@testing-library/react";
import { NewChip } from "./chips";

describe("NewChip", () => {
  it("should render with default props", () => {
    const { getByText } = render(<NewChip />);
    expect(getByText("New")).toBeInTheDocument();
  });
});
