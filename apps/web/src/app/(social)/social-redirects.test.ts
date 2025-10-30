import { SOCIAL_PLATFORMS } from "@web/config/social-redirects";
import { NextResponse } from "next/server";
import { GET, generateStaticParams } from "./[platform]/route";

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn(),
    json: vi.fn(),
  },
}));

describe("Social Media Redirect Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const socialPlatforms = [
    {
      name: "Twitter",
      platform: "twitter",
      url: "https://twitter.com/sgcarstrends",
    },
    {
      name: "Instagram",
      platform: "instagram",
      url: "https://instagram.com/sgcarstrends",
    },
    {
      name: "LinkedIn",
      platform: "linkedin",
      url: "https://linkedin.com/company/sgcarstrends",
    },
    {
      name: "Telegram",
      platform: "telegram",
      url: "https://t.me/sgcarstrends",
    },
    {
      name: "GitHub",
      platform: "github",
      url: "https://github.com/sgcarstrends",
    },
    {
      name: "Discord",
      platform: "discord",
      url: "https://discord.com/invite/xxtQueEqt6",
    },
  ];

  socialPlatforms.forEach(({ name, platform, url }) => {
    it(`should redirect to ${name} profile with UTM parameters and 301 status`, async () => {
      const mockRedirect = vi.mocked(NextResponse.redirect);

      await GET({} as any, { params: Promise.resolve({ platform }) } as any);

      const expectedUrl = `${url}?utm_source=sgcarstrends&utm_medium=social_redirect&utm_campaign=${name.toLowerCase()}_profile`;
      expect(mockRedirect).toHaveBeenCalledWith(expectedUrl, 301);
    });
  });

  it("should return 404 for invalid platform", async () => {
    const mockJson = vi.mocked(NextResponse.json);

    await GET(
      {} as any,
      { params: Promise.resolve({ platform: "invalid" }) } as any,
    );

    expect(mockJson).toHaveBeenCalledWith(
      { error: "Invalid social platform" },
      { status: 404 },
    );
  });

  it("should generate static params for all platforms", async () => {
    const params = generateStaticParams();

    expect(params).toEqual(
      Object.keys(SOCIAL_PLATFORMS).map((platform) => ({ platform })),
    );
  });
});
