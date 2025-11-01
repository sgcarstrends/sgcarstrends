import { render, screen } from "@testing-library/react";
import { navigationSections } from "@web/config/navigation";
import { SectionTabs } from "./section-tabs";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockUsePathname = vi.mocked(await import("next/navigation")).usePathname;

describe("SectionTabs", () => {
  it("should render all navigation items", () => {
    mockUsePathname.mockReturnValue("/");

    render(<SectionTabs sections={navigationSections} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Cars")).toBeInTheDocument();
    expect(screen.getByText("COE")).toBeInTheDocument();
    // expect(screen.getByText("Misc")).toBeInTheDocument();
  });

  it("should mark home route as active when pathname is /", () => {
    mockUsePathname.mockReturnValue("/");

    render(<SectionTabs sections={navigationSections} />);

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toHaveClass(
      "font-semibold",
      "text-2xl",
      "text-black",
      "lg:text-4xl",
    );
  });

  it("should mark cars route as active when pathname starts with /cars", () => {
    mockUsePathname.mockReturnValue("/cars");

    render(<SectionTabs sections={navigationSections} />);

    const carsLink = screen.getByText("Cars");
    expect(carsLink).toHaveClass(
      "font-semibold",
      "text-2xl",
      "text-black",
      "lg:text-4xl",
    );
  });

  it("should mark coe route as active when pathname starts with /coe", () => {
    mockUsePathname.mockReturnValue("/coe/results");

    render(<SectionTabs sections={navigationSections} />);

    const coeLink = screen.getByText("COE");
    expect(coeLink).toHaveClass(
      "font-semibold",
      "text-2xl",
      "text-black",
      "lg:text-4xl",
    );
  });

  it("should not mark home as active when on other routes", () => {
    mockUsePathname.mockReturnValue("/cars");

    render(<SectionTabs sections={navigationSections} />);

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toHaveClass(
      "text-gray-400",
      "text-lg",
      "hover:text-gray-600",
      "lg:text-2xl",
    );
  });

  it("should render links with correct hrefs", () => {
    mockUsePathname.mockReturnValue("/");

    render(<SectionTabs sections={navigationSections} />);

    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText("Cars").closest("a")).toHaveAttribute(
      "href",
      "/cars",
    );
    expect(screen.getByText("COE").closest("a")).toHaveAttribute(
      "href",
      "/coe",
    );
    // expect(screen.getByText("Misc").closest("a")).toHaveAttribute(
    //   "href",
    //   "/misc",
    // );
  });
});
