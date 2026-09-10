vi.mock("flags/next", () => ({ evaluate: vi.fn() }));
vi.mock("@web/flags", () => ({
  advertisePage: "advertisePage",
  advertiseNav: "advertiseNav",
  blogNav: "blogNav",
  socialLinks: "socialLinks",
}));

import { evaluate } from "flags/next";
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
    vi.clearAllMocks();
  });

  it("should evaluate the site flags with a bare request", async () => {
    const values = {
      advertisePage: true,
      advertiseNav: true,
      blogNav: false,
      socialLinks: false,
    };
    vi.mocked(evaluate).mockResolvedValueOnce(values);

    await expect(getChromeFlags()).resolves.toEqual(values);
    expect(evaluate).toHaveBeenCalledWith(
      {
        advertisePage: "advertisePage",
        advertiseNav: "advertiseNav",
        blogNav: "blogNav",
        socialLinks: "socialLinks",
      },
      expect.any(Request),
    );
    expect(cacheLifeMock).toHaveBeenCalledWith("max");
    expect(cacheTagMock).toHaveBeenCalledWith("flags");
  });

  it("should fall back to defaults when evaluation fails", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(evaluate).mockRejectedValueOnce(new Error("offline"));

    await expect(getChromeFlags()).resolves.toEqual(DEFAULTS);
  });
});
