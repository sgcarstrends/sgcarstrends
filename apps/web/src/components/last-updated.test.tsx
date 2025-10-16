import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { LastUpdated } from "./shared/last-updated";

const mockLastUpdated = 1735660800; // 1 Jan 2025, 00:00:00 GMT+8

describe("LastUpdated", () => {
  let dayjsFormatSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    // Mock dayjs format so tests aren't dependent on environment/timezone
    dayjsFormatSpy = vi
      .spyOn(dayjs.prototype, "format")
      .mockReturnValue("1 Jan 2025, 00:00AM");
  });

  afterAll(() => {
    dayjsFormatSpy.mockRestore();
  });

  it("should render", () => {
    const { container } = render(<LastUpdated lastUpdated={mockLastUpdated} />);
    expect(container).toMatchSnapshot();
  });

  it("renders the separator and label", () => {
    render(<LastUpdated lastUpdated={mockLastUpdated} />);
    expect(screen.getByText(/Last updated:/)).toBeVisible();
  });

  it("displays the mocked formatted date", () => {
    render(<LastUpdated lastUpdated={mockLastUpdated} />);
    // We expect our mock return value to appear in the DOM
    expect(screen.getByText("1 Jan 2025, 00:00AM")).toBeVisible();
  });

  it("formats date using dayjs with correct format string", () => {
    render(<LastUpdated lastUpdated={mockLastUpdated} />);
    // Verify dayjs format was called with the expected format string
    expect(dayjsFormatSpy).toHaveBeenCalledWith("DD MMM YYYY, h:mmA");
  });
});
