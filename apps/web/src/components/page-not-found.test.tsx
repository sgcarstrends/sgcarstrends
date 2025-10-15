import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageNotFound } from "./page-not-found";

describe("PageNotFound", () => {
  it("renders the 404 error message", () => {
    const { container } = render(<PageNotFound />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The page you're looking for doesn't exist or has been moved.",
      ),
    ).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<PageNotFound />);

    expect(screen.getByText("Go to Homepage")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("renders help text with links", () => {
    render(<PageNotFound />);

    expect(screen.getByText(/Need help\? Visit our/)).toBeInTheDocument();
    expect(screen.getByText(/or go back to the/)).toBeInTheDocument();
  });

  it("has correct link href attributes", () => {
    render(<PageNotFound />);

    const faqLink = screen.getByRole("link", { name: /faq page/i });
    expect(faqLink).toHaveAttribute("href", "/faq");
  });
});
