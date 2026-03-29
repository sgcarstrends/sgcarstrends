import { render, screen } from "@testing-library/react";
import { Infobox } from "./infobox";

vi.mock("@heroui/react", () => ({
  Alert: Object.assign(
    ({
      status,
      className,
      children,
    }: {
      status?: string;
      className?: string;
      children?: React.ReactNode;
    }) => (
      <section data-testid="alert" data-status={status} className={className}>
        {children}
      </section>
    ),
    {
      Indicator: () => <span data-testid="alert-indicator" />,
      Content: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="alert-content">{children}</div>
      ),
      Title: ({ children }: { children?: React.ReactNode }) => (
        <h3 data-testid="alert-title">{children}</h3>
      ),
      Description: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="alert-description">{children}</div>
      ),
    },
  ),
}));

describe("Infobox", () => {
  it("should render title and markdown content", () => {
    const { container } = render(
      <Infobox
        title="What is COE?"
        content="The **Certificate of Entitlement** controls vehicle ownership."
      />,
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText("What is COE?")).toBeVisible();
    expect(screen.getByText("Certificate of Entitlement")).toBeVisible();
  });

  it("should use the expected alert styling", () => {
    render(<Infobox title="Info" content="A short note" />);

    const alert = screen.getByTestId("alert");
    expect(alert).toHaveAttribute("data-status", "accent");
    expect(alert).toHaveClass("px-4", "py-3");
  });
});
