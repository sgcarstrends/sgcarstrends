import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { LastUpdated } from "./shared/last-updated";

const mockLastUpdated = 1735660800; // 1 Jan 2025, 00:00:00 GMT+8
const mockFormattedDate = "01 Jan 2025, 12:00am";

// Mock date-fns format so tests aren't dependent on environment/timezone
vi.mock("date-fns", () => ({
  format: vi.fn(() => mockFormattedDate),
}));

describe("LastUpdated", () => {
  it("should render", () => {
    const { container } = render(<LastUpdated lastUpdated={mockLastUpdated} />);
    expect(container).toMatchSnapshot();
  });

  it("should render the separator and label", () => {
    render(<LastUpdated lastUpdated={mockLastUpdated} />);
    expect(screen.getByText(/Last updated:/)).toBeVisible();
  });

  it("should display the mocked formatted date", () => {
    render(<LastUpdated lastUpdated={mockLastUpdated} />);
    // We expect our mock return value to appear in the DOM
    expect(screen.getByText(mockFormattedDate)).toBeVisible();
  });

  it("should format date using date-fns with correct format string", () => {
    render(<LastUpdated lastUpdated={mockLastUpdated} />);
    // Verify date-fns format was called with the expected format string
    expect(format).toHaveBeenCalledWith(mockLastUpdated, "dd MMM yyyy, h:mma");
  });
});
