import { fireEvent, render, screen } from "@testing-library/react";
import NoData from "./shared/no-data";

const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe("NoData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render error message and buttons", () => {
    render(<NoData />);

    expect(screen.getByText("No Data Available")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The requested page does not exist or no data is available.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go home/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("should render alert component", () => {
    render(<NoData />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should navigate to home when Go Home button is clicked", () => {
    render(<NoData />);
    fireEvent.click(screen.getByRole("button", { name: /go home/i }));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should go back when Go Back button is clicked", () => {
    render(<NoData />);
    fireEvent.click(screen.getByRole("button", { name: /go back/i }));
    expect(mockBack).toHaveBeenCalled();
  });
});
