import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubscribeForm } from "../subscribe-form";

// Mock the server action
vi.mock("@web/actions/subscribe-action", () => ({
  subscribeAction: vi.fn(),
}));

// Mock HeroUI toast
vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

describe("SubscribeForm", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
  });

  it("should render email input and subscribe button", () => {
    render(<SubscribeForm />);

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe/i }),
    ).toBeInTheDocument();
  });

  it("should render form element", () => {
    const { container } = render(<SubscribeForm />);
    const form = container.querySelector("form");

    expect(form).toBeInTheDocument();
  });

  it("should have required email input", () => {
    render(<SubscribeForm />);
    const input = screen.getByPlaceholderText("Enter your email");

    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("type", "email");
  });

  it("should render turnstile widget container", () => {
    const { container } = render(<SubscribeForm />);
    const turnstileDiv = container.querySelector(".cf-turnstile");

    expect(turnstileDiv).toBeInTheDocument();
    expect(turnstileDiv).toHaveAttribute("data-sitekey", "test-site-key");
    expect(turnstileDiv).toHaveAttribute("data-theme", "auto");
  });

  it("should have submit button enabled by default", () => {
    render(<SubscribeForm />);
    const button = screen.getByRole("button", { name: /subscribe/i });

    expect(button).not.toBeDisabled();
  });
});
