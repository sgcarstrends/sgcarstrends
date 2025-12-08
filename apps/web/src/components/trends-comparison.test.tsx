import { render, screen } from "@testing-library/react";
import { TrendsComparison } from "@web/components/trends-comparison";
import { vi } from "vitest";

describe("TrendsComparison", () => {
  it("should render TrendsComparison content when open", () => {
    const handleChange = vi.fn();
    render(<TrendsComparison isOpen onOpenChange={handleChange} />);

    expect(screen.getByText("Trends Comparison")).toBeInTheDocument();
  });
});
