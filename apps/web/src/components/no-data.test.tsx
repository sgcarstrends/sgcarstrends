import { render, screen } from "@testing-library/react";
import NoData from "./shared/no-data";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("NoData", () => {
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
});
