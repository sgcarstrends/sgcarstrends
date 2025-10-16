import { renderHook } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import useMaintenance from "./use-maintenance";

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("useMaintenance", () => {
  const mockReplace = vi.fn();
  const mockGet = vi.fn();
  let intervalSpy: any;

  const waitForAsyncEffect = (delay = 0) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as any).mockReturnValue({
      replace: mockReplace,
    });

    (useSearchParams as any).mockReturnValue({
      get: mockGet,
    });

    intervalSpy = vi.spyOn(global, "setInterval");
    vi.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should redirect to home when not in maintenance mode and no 'from' param", async () => {
    // Mock environment without maintenance mode
    vi.stubEnv("MAINTENANCE_MODE", undefined);
    mockGet.mockReturnValue(null);

    renderHook(() => useMaintenance(1000));

    // Wait for the async effect to complete
    await waitForAsyncEffect();

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("should redirect to 'from' param URL when not in maintenance mode", async () => {
    vi.stubEnv("MAINTENANCE_MODE", undefined);
    mockGet.mockReturnValue("/dashboard");

    renderHook(() => useMaintenance(1000));

    await waitForAsyncEffect();

    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("should decode URI component from 'from' param", async () => {
    vi.stubEnv("MAINTENANCE_MODE", undefined);
    mockGet.mockReturnValue("/dashboard%2Fsettings");

    renderHook(() => useMaintenance(1000));

    await waitForAsyncEffect();

    expect(mockReplace).toHaveBeenCalledWith("/dashboard/settings");
  });

  it("should not redirect when in maintenance mode", async () => {
    vi.stubEnv("MAINTENANCE_MODE", "true");

    renderHook(() => useMaintenance(1000));

    await waitForAsyncEffect();

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should set up polling interval with custom interval", () => {
    renderHook(() => useMaintenance(2000));

    expect(intervalSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
  });

  it("should use default polling interval when not specified", () => {
    renderHook(() => useMaintenance());

    expect(intervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it("should clear interval on unmount", () => {
    const { unmount } = renderHook(() => useMaintenance(1000));

    unmount();

    expect(global.clearInterval).toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Set up normal mocks first
    vi.stubEnv("MAINTENANCE_MODE", undefined);
    mockGet.mockReturnValue(null);

    // Make router.replace throw an error to simulate an error in the checkMaintenance function
    mockReplace.mockImplementation(() => {
      throw new Error("Test error");
    });

    renderHook(() => useMaintenance(1000));

    await waitForAsyncEffect(10);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error checking maintenance status:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
