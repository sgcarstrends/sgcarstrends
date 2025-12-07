import { render, screen } from "@testing-library/react";
import { Navigation } from "./navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@heroui/tabs", () => ({
  Tabs: ({
    children,
    selectedKey,
    ...props
  }: {
    children: React.ReactNode;
    selectedKey: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="tabs" data-selected-key={selectedKey} {...props}>
      {children}
    </div>
  ),
  Tab: ({ title, href }: { title: string; href: string }) => (
    <a href={href} data-testid="tab">
      {title}
    </a>
  ),
}));

const mockUsePathname = vi.mocked(await import("next/navigation")).usePathname;

describe("Navigation", () => {
  describe("Section Navigation", () => {
    it("should render all navigation items", () => {
      mockUsePathname.mockReturnValue("/");

      render(<Navigation />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Cars")).toBeInTheDocument();
      expect(screen.getByText("COE")).toBeInTheDocument();
    });

    it("should mark home route as active when pathname is /", () => {
      mockUsePathname.mockReturnValue("/");

      render(<Navigation />);

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

      render(<Navigation />);

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

      render(<Navigation />);

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

      render(<Navigation />);

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

      render(<Navigation />);

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
    });
  });

  describe("Sub Navigation", () => {
    it("should render sub navigation for Dashboard section", () => {
      mockUsePathname.mockReturnValue("/");

      render(<Navigation />);

      const tabs = screen.getByTestId("tabs");
      expect(tabs).toBeInTheDocument();
      expect(tabs).toHaveAttribute("data-selected-key", "/");
    });

    it("should render sub navigation for Cars section", () => {
      mockUsePathname.mockReturnValue("/cars");

      render(<Navigation />);

      const tabs = screen.getByTestId("tabs");
      expect(tabs).toBeInTheDocument();
      expect(tabs).toHaveAttribute("data-selected-key", "/cars");

      expect(screen.getByText("New Registrations")).toBeInTheDocument();
      expect(screen.getByText("Makes")).toBeInTheDocument();
      expect(screen.getByText("Fuel Types")).toBeInTheDocument();
      expect(screen.getByText("Vehicle Types")).toBeInTheDocument();
    });

    it("should render sub navigation for COE section", () => {
      mockUsePathname.mockReturnValue("/coe");

      render(<Navigation />);

      const tabs = screen.getByTestId("tabs");
      expect(tabs).toBeInTheDocument();

      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("Results")).toBeInTheDocument();
      expect(screen.getByText("PQP Rates")).toBeInTheDocument();
    });
  });
});
