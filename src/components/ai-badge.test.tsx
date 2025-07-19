import { render, screen } from "@testing-library/react";
import { AIBadge } from "./ai-badge";

describe("AIBadge", () => {
  it("should render with model name", () => {
    render(<AIBadge modelName="Gemini 2.5 Pro" />);
    
    expect(screen.getByText("Gemini 2.5 Pro")).toBeInTheDocument();
  });

  it("should render with custom className", () => {
    render(<AIBadge modelName="Gemini 2.5 Pro" className="custom-class" />);
    
    const badge = screen.getByText("Gemini 2.5 Pro").closest('span');
    expect(badge).toHaveClass("custom-class");
  });

  it("should render with default styling", () => {
    render(<AIBadge modelName="Claude" />);
    
    const badge = screen.getByText("Claude").closest('span');
    expect(badge).toHaveClass("border-blue-200");
    expect(badge).toHaveClass("bg-gradient-to-r");
    expect(badge).toHaveClass("from-blue-50");
    expect(badge).toHaveClass("to-blue-100");
    expect(badge).toHaveClass("text-xs");
    expect(badge).toHaveClass("text-blue-800");
  });

  it("should render sparkles icon", () => {
    render(<AIBadge modelName="GPT-4" />);
    
    // Check for the SVG element with the sparkles class
    const sparklesIcon = document.querySelector('.lucide-sparkles');
    expect(sparklesIcon).toBeInTheDocument();
  });

  it("should handle different model names", () => {
    const { rerender } = render(<AIBadge modelName="Model A" />);
    expect(screen.getByText("Model A")).toBeInTheDocument();
    
    rerender(<AIBadge modelName="Model B" />);
    expect(screen.getByText("Model B")).toBeInTheDocument();
  });
});