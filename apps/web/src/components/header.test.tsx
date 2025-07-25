import { render } from "@testing-library/react";
import { Header } from "@web/components/header";

describe("Navbar", () => {
  it("should render correctly", () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });
});
