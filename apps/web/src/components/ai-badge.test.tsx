import { render } from "@testing-library/react";
import { AIBadge } from "./ai-badge";

describe("AIBadge", () => {
  it("should render correctly", () => {
    const { container } = render(<AIBadge />);
    expect(container).toMatchSnapshot();
  });

  it("should render sparkles icon", () => {
    render(<AIBadge />);

    // Check for the SVG element with the sparkles class
    const sparklesIcon = document.querySelector(".lucide-sparkles");
    expect(sparklesIcon).toBeVisible();
  });
});
