import { render } from "@testing-library/react";
import { Sparkline } from "../sparkline";

describe("Sparkline", () => {
  it("should render sparkline with data", () => {
    const data = [
      { label: "Jan 2024", value: 95000 },
      { label: "Feb 2024", value: 98000 },
      { label: "Mar 2024", value: 97000 },
    ];

    const { container } = render(<Sparkline data={data} />);
    expect(container).toMatchSnapshot();
  });

  it("should return null when data is empty", () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should apply custom height", () => {
    const data = [
      { label: "Jan 2024", value: 95000 },
      { label: "Feb 2024", value: 98000 },
    ];

    const { container } = render(<Sparkline data={data} height="h-16" />);
    expect(container.querySelector(".h-16")).toBeInTheDocument();
  });
});
