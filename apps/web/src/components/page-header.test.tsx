import { render, screen } from "@testing-library/react";
import { PageHeader } from "@web/components/page-header";

describe("PageHeader", () => {
  it("should render title, subtitle, last updated, and children", () => {
    render(
      <PageHeader
        title="COE Trends"
        subtitle="Latest insights"
        lastUpdated={1704067200000}
      >
        <span data-testid="extra-actions">Actions</span>
      </PageHeader>,
    );

    expect(screen.getByText("COE Trends")).toBeInTheDocument();
    expect(screen.getByText("Latest insights")).toBeInTheDocument();
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    expect(screen.getByTestId("extra-actions")).toBeInTheDocument();
  });

  it("should render without optional props", () => {
    render(<PageHeader title="Simple Header" />);

    expect(screen.getByText("Simple Header")).toBeInTheDocument();
  });
});
