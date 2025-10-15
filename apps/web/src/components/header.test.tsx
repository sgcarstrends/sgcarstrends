import { render } from "@testing-library/react";
import { Header } from "@web/components/header";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navbar", () => {
  it("should render correctly", () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });
});
