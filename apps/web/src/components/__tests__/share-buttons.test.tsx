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

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

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

  it("should open Twitter share URL when X button is clicked", () => {
    render(<ShareButtons {...defaultProps} />);

    const twitterButton = screen.getByLabelText("Share on X");
    fireEvent.click(twitterButton);

    expect(mockWindowOpen).toHaveBeenCalled();
    const [url, target] = mockWindowOpen.mock.calls[0];
    expect(url).toContain("twitter.com/intent/tweet");
    expect(url).toContain(encodeURIComponent(defaultProps.url));
    expect(target).toBe("_blank");
  });

  it("should open LinkedIn share URL when LinkedIn button is clicked", () => {
    render(<ShareButtons {...defaultProps} />);

    const linkedinButton = screen.getByLabelText("Share on LinkedIn");
    fireEvent.click(linkedinButton);

    expect(mockWindowOpen).toHaveBeenCalled();
    const [url, target] = mockWindowOpen.mock.calls[0];
    expect(url).toContain("linkedin.com/sharing/share-offsite");
    expect(url).toContain(encodeURIComponent(defaultProps.url));
    expect(target).toBe("_blank");
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

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("custom-class");
    });
  });

  it("should render 4 buttons total (1 mobile + 3 desktop)", () => {
    render(<ShareButtons {...defaultProps} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });
});
