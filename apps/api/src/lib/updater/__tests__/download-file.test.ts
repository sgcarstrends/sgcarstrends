import { downloadFile } from "@api/lib/updater/services/download-file";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@api/config", () => ({
  AWS_LAMBDA_TEMP_DIR: "/tmp",
}));

// Mock fetch
global.fetch = vi.fn();

// Mock AdmZip
vi.mock("adm-zip", () => {
  const mockEntries = [
    {
      isDirectory: false,
      entryName: "test.csv",
    },
    {
      isDirectory: false,
      entryName: "data.csv",
    },
    {
      isDirectory: true,
      entryName: "folder/",
    },
  ];

  return {
    default: class MockAdmZip {
      getEntries() {
        return mockEntries;
      }

      extractEntryTo() {
        return true;
      }
    },
  };
});

describe("downloadFile", () => {
  const mockUrl = "https://example.com/test.zip";

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock successful fetch response
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    } as unknown as Response);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and extract files from a zip", async () => {
    const result = await downloadFile(mockUrl);

    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toBe("test.csv"); // Should return first file
  });

  it("should return the specific file when csvFile parameter is provided", async () => {
    const result = await downloadFile(mockUrl, "data");

    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toBe("data.csv");
  });

  it("should handle HTTP errors and log detailed error information", async () => {
    const mockErrorBody = "<html><body>Not Found</body></html>";
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: vi.fn().mockResolvedValue(mockErrorBody),
    } as unknown as Response);

    await expect(downloadFile(mockUrl)).rejects.toThrow(
      "HTTP error! status: 404",
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Download failed:",
      expect.objectContaining({
        status: 404,
        statusText: "Not Found",
        url: mockUrl,
        errorBody: mockErrorBody,
        timestamp: expect.any(String),
      }),
    );

    consoleErrorSpy.mockRestore();
  });

  it("should handle 403 forbidden errors with detailed logging", async () => {
    const mockErrorBody =
      "<html><body>403 Forbidden - Access Denied</body></html>";
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      text: vi.fn().mockResolvedValue(mockErrorBody),
    } as unknown as Response);

    await expect(downloadFile(mockUrl)).rejects.toThrow(
      "HTTP error! status: 403",
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Download failed:",
      expect.objectContaining({
        status: 403,
        statusText: "Forbidden",
        url: mockUrl,
        errorBody: mockErrorBody,
        timestamp: expect.any(String),
      }),
    );

    consoleErrorSpy.mockRestore();
  });

  it("should handle fetch failures", async () => {
    const mockError = new Error("Network error");
    vi.mocked(global.fetch).mockRejectedValue(mockError);

    await expect(downloadFile(mockUrl)).rejects.toThrow(mockError);
  });
});
