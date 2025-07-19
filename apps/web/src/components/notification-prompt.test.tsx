import { render, screen } from "@testing-library/react";
import useStore from "@/app/store";
import { NotificationPrompt } from "./notification-prompt";

vi.mock("@/app/store", () => ({
  default: vi.fn(() => ({
    notificationStatus: "default",
    setNotificationStatus: vi.fn(),
  })),
}));

const mockUseStore = useStore as vi.Mock;

describe("NotificationPrompt Component", () => {
  let originalNotification: any;

  beforeAll(() => {
    originalNotification = global.Notification;

    global.Notification = {
      requestPermission: vi.fn(),
      permission: "default",
    } as any;
  });

  afterAll(() => {
    global.Notification = originalNotification;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set notification status to current permission on mount", () => {
    const setNotificationStatus = vi.fn();
    mockUseStore.mockReturnValue({
      notificationStatus: "default",
      setNotificationStatus,
    });

    render(<NotificationPrompt />);

    expect(setNotificationStatus).toHaveBeenCalledWith("default");
  });

  it("should display an alert when notificationStatus is 'default'", () => {
    const setNotificationStatus = vi.fn();
    mockUseStore.mockReturnValue({
      notificationStatus: "default",
      setNotificationStatus,
    });

    render(<NotificationPrompt />);

    expect(screen.getByText("Enable Notifications?")).toBeInTheDocument();
    expect(screen.getByText(
      "Stay updated with the latest news and alerts by enabling browser notifications"
    )).toBeInTheDocument();
    expect(screen.getByText("Allow")).toBeInTheDocument();
    expect(screen.getByText("Deny")).toBeInTheDocument();
  });

  it("should not display anything if notificationStatus is not 'default' (e.g., granted/denied)", () => {
    const setNotificationStatus = vi.fn();
    mockUseStore.mockReturnValue({
      notificationStatus: "granted",
      setNotificationStatus,
    });

    const { container } = render(<NotificationPrompt />);

    expect(container.firstChild).toBeNull();
  });
});
