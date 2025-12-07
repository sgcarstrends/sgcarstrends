import { fireEvent, render, screen } from "@testing-library/react";
import { ShareButtons } from "@web/components/share-buttons";

// Mock clipboard API
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

// Mock addToast
vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

describe("ShareButtons", () => {
  const defaultProps = {
    url: "https://sgcarstrends.com/cars",
    title: "Car Registrations - SG Cars Trends",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render both mobile and desktop share buttons", () => {
    render(<ShareButtons {...defaultProps} />);

    // Mobile share button
    expect(screen.getByLabelText("Share")).toBeInTheDocument();

    // Desktop buttons
    expect(screen.getByLabelText("Share on X")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy link")).toBeInTheDocument();
  });

  it("should have correct Twitter share URL as anchor", () => {
    render(<ShareButtons {...defaultProps} />);

    const twitterLink = screen.getByLabelText("Share on X");

    expect(twitterLink).toHaveAttribute(
      "href",
      expect.stringContaining("twitter.com/intent/tweet"),
    );
    expect(twitterLink).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(defaultProps.url)),
    );
    expect(twitterLink).toHaveAttribute("target", "_blank");
    expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should have correct LinkedIn share URL as anchor", () => {
    render(<ShareButtons {...defaultProps} />);

    const linkedinLink = screen.getByLabelText("Share on LinkedIn");

    expect(linkedinLink).toHaveAttribute(
      "href",
      expect.stringContaining("linkedin.com/sharing/share-offsite"),
    );
    expect(linkedinLink).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(defaultProps.url)),
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should copy link to clipboard when copy button is clicked", async () => {
    render(<ShareButtons {...defaultProps} />);

    const copyButton = screen.getByLabelText("Copy link");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      defaultProps.url,
    );
  });

  it("should apply custom className", () => {
    render(<ShareButtons {...defaultProps} className="custom-class" />);

    // Check mobile button
    const mobileButton = screen.getByLabelText("Share");
    expect(mobileButton).toHaveClass("custom-class");

    // Check desktop links and button
    const twitterLink = screen.getByLabelText("Share on X");
    const linkedinLink = screen.getByLabelText("Share on LinkedIn");
    const copyButton = screen.getByLabelText("Copy link");

    expect(twitterLink).toHaveClass("custom-class");
    expect(linkedinLink).toHaveClass("custom-class");
    expect(copyButton).toHaveClass("custom-class");
  });

  it("should render 4 interactive elements", () => {
    render(<ShareButtons {...defaultProps} />);

    // 4 buttons total: mobile share, twitter (as="a"), linkedin (as="a"), copy link
    // HeroUI Button with as="a" still has role="button"
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });
});
