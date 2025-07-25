import { fetchApi } from "@web/utils/fetch-api";

describe("fetchApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should return data for a successful API call", async () => {
    const mockResponse = { data: "test" };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const url = "https://example.com/api/test";
    const data = await fetchApi(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `Bearer ${process.env.SG_CARS_TRENDS_API_TOKEN}`,
      },
      cache: "force-cache",
      next: {
        revalidate: 86400,
        tags: ["api"],
      },
    });
    expect(data).toEqual(mockResponse);
  });

  it("should throw an error for a non-OK response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as Response);

    const url = "https://example.com/api/test";
    await expect(fetchApi(url)).rejects.toThrow(
      `API call failed: ${url} - 404 - Not Found`,
    );
  });

  it("should handle network errors", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const url = "https://example.com/api/test";
    await expect(fetchApi(url)).rejects.toThrow("Network error");
  });
});
