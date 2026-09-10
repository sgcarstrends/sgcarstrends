const evaluate = vi.fn();
const initialize = vi.fn();

vi.mock("@vercel/flags-core", () => ({
  createClient: vi.fn(() => ({ initialize, evaluate })),
}));

import { createClient } from "@vercel/flags-core";
import { cacheLifeMock, cacheTagMock } from "../queries/test-utils";
import { getChromeFlags } from "./chrome-flags";

const DEFAULTS = {
  advertisePage: false,
  advertiseNav: false,
  blogNav: false,
  socialLinks: false,
};

describe("getChromeFlags", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("should return defaults without an SDK key", async () => {
    vi.stubEnv("FLAGS", "");

    await expect(getChromeFlags()).resolves.toEqual(DEFAULTS);
    expect(createClient).not.toHaveBeenCalled();
    expect(cacheLifeMock).toHaveBeenCalledWith("max");
    expect(cacheTagMock).toHaveBeenCalledWith("flags");
  });

  it("should evaluate the site flags with the core client", async () => {
    vi.stubEnv("FLAGS", "sdk-key");
    evaluate
      .mockResolvedValueOnce({ value: true })
      .mockResolvedValueOnce({ value: true })
      .mockResolvedValueOnce({ value: false })
      .mockResolvedValueOnce({ value: undefined });

    await expect(getChromeFlags()).resolves.toEqual({
      advertisePage: true,
      advertiseNav: true,
      blogNav: false,
      socialLinks: false,
    });
    expect(createClient).toHaveBeenCalledWith("sdk-key", {
      disableMetrics: true,
    });
    expect(initialize).toHaveBeenCalledOnce();
    expect(evaluate).toHaveBeenCalledWith("advertise-page", false);
    expect(evaluate).toHaveBeenCalledWith("advertise-nav", false);
    expect(evaluate).toHaveBeenCalledWith("blog-nav", false);
    expect(evaluate).toHaveBeenCalledWith("social-links", false);
  });

  it("should fall back to defaults when evaluation fails", async () => {
    vi.stubEnv("FLAGS", "sdk-key");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    initialize.mockRejectedValueOnce(new Error("offline"));

    await expect(getChromeFlags()).resolves.toEqual(DEFAULTS);
  });
});
