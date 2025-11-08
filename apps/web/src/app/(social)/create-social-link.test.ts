import { NextResponse } from "next/server";

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn(),
  },
}));

describe("Social Media Redirect Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  [
    {
      name: "Twitter",
      route: "./twitter/route",
      url: "https://twitter.com/sgcarstrends",
    },
    {
      name: "Instagram",
      route: "./instagram/route",
      url: "https://instagram.com/sgcarstrends",
    },
    {
      name: "LinkedIn",
      route: "./linkedin/route",
      url: "https://linkedin.com/company/sgcarstrends",
    },
    {
      name: "Telegram",
      route: "./telegram/route",
      url: "https://t.me/sgcarstrends",
    },
    {
      name: "GitHub",
      route: "./github/route",
      url: "https://github.com/sgcarstrends",
    },
    {
      name: "Discord",
      route: "./discord/route",
      url: "https://discord.com/invite/xxtQueEqt6",
    },
  ].forEach(({ name, route, url }) => {
    it(`should redirect to ${name} profile with UTM parameters and 301 status`, async () => {
      const { GET } = await import(route);
      const mockRedirect = vi.mocked(NextResponse.redirect);

      await GET();

      const expectedUrl = `${url}?utm_source=sgcarstrends&utm_medium=social_redirect&utm_campaign=${name.toLowerCase()}_profile`;
      expect(mockRedirect).toHaveBeenCalledWith(expectedUrl, 301);
    });
  });
});
