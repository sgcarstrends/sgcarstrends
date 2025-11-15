import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SubscribeForm } from "../subscribe-form";

// Mock the server action
vi.mock("@web/actions", () => ({
  subscribeAction: vi.fn(),
}));

// Mock HeroUI toast
vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

describe("SubscribeForm", () => {
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
});
