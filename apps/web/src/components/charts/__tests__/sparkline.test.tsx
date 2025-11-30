import { render } from "@testing-library/react";
import { Sparkline } from "../sparkline";

describe("Sparkline", () => {
  it("should render sparkline with data", () => {
    const data = [{ value: 95000 }, { value: 98000 }, { value: 97000 }];

    const { container } = render(<Sparkline data={data} />);
    expect(container).toMatchSnapshot();
  });

  it("should return null when data is empty", () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should apply custom height", () => {
    const data = [{ value: 95000 }, { value: 98000 }];

    const { container } = render(<Sparkline data={data} height="h-16" />);
    expect(container.querySelector(".h-16")).toBeInTheDocument();
  });

  it("should render with up trend color", () => {
    const data = [{ value: 95000 }, { value: 98000 }];

    const { container } = render(<Sparkline data={data} trend="up" />);
    expect(container).toMatchSnapshot();
  });

  it("should render with down trend color", () => {
    const data = [{ value: 98000 }, { value: 95000 }];

    const { container } = render(<Sparkline data={data} trend="down" />);
    expect(container).toMatchSnapshot();
  });

  it("should render with neutral trend color", () => {
    const data = [{ value: 95000 }, { value: 95000 }];

    const { container } = render(<Sparkline data={data} trend="neutral" />);
    expect(container).toMatchSnapshot();
  });

  it("should render with primary color when trend is undefined", () => {
    const data = [{ value: 95000 }, { value: 98000 }];

    const { container } = render(<Sparkline data={data} />);
    expect(container).toMatchSnapshot();
  });
});
