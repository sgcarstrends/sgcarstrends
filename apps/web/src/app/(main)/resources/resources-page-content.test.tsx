import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResourcesPageContent } from "./resources-page-content";

describe("ResourcesPageContent", () => {
  it("should render the page header", () => {
    render(<ResourcesPageContent />);

    expect(screen.getByText("Resources")).toBeInTheDocument();
  });

  it("should render all tab titles", () => {
    render(<ResourcesPageContent />);

    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(screen.getByText("Glossary")).toBeInTheDocument();
    expect(screen.getByText("Data Sources")).toBeInTheDocument();
    expect(screen.getByText("Guides")).toBeInTheDocument();
  });

  it("should render FAQ tab content by default", () => {
    render(<ResourcesPageContent />);

    expect(
      screen.getByText("Certificate of Entitlement (COE)"),
    ).toBeInTheDocument();
    expect(screen.getByText("What is COE in Singapore?")).toBeInTheDocument();
  });

  it("should render the still have questions section in FAQ tab", () => {
    render(<ResourcesPageContent />);

    expect(screen.getByText("Still Have Questions?")).toBeInTheDocument();
  });
});
