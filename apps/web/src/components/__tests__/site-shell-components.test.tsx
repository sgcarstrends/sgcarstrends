import { render, screen, waitFor } from "@testing-library/react";
import { Analytics } from "@web/components/analytics";
import { Announcement } from "@web/components/announcement";
import { Banner } from "@web/components/banner";
import { ComingSoon } from "@web/components/coming-soon";
import { Footer } from "@web/components/footer";
import { MaintenanceNotice } from "@web/components/maintenance-notice";
import { MetricsComparison } from "@web/components/metrics-comparison";
import { PageHeader } from "@web/components/page-header";
import { Progress } from "@web/components/progress";
import { QuotaPremiumTicker } from "@web/components/quota-premium-ticker";
import { MetricCard } from "@web/components/shared/metric-card";
import { StructuredData } from "@web/components/structured-data";
import { TrendsComparisonBottomSheet } from "@web/components/trends-comparison-bottom-sheet";
import type { Announcement as AnnouncementType, COEResult } from "@web/types";
import type { ReactElement } from "react";
import { vi } from "vitest";
import { createUseStoreMock } from "../../../tests/test-utils";

const announcementsFixture: AnnouncementType[] = [];
let mockPathname = "/";
const mockUseMaintenance = vi.fn();
const originalFetch = global.fetch;
const originalSendBeacon = navigator.sendBeacon;

const { state: mockStoreState } = createUseStoreMock();

vi.mock("@web/app/store", () => ({
  __esModule: true,
  default: (selector?: (state: typeof mockStoreState) => unknown) =>
    selector ? selector(mockStoreState) : mockStoreState,
}));

vi.mock("@web/hooks/use-maintenance", () => ({
  __esModule: true,
  default: () => mockUseMaintenance(),
}));

vi.mock("@web/components/shared/month-selector", () => ({
  MonthSelector: ({ months }: { months: string[] }) => (
    <div data-testid="month-selector">{months.join(",") || "no-months"}</div>
  ),
}));

vi.mock("next/script", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <script {...props} />,
}));

vi.mock("@web/config", () => ({
  get announcements() {
    return announcementsFixture;
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

const createCoeResult = (
  vehicle_class: COEResult["vehicle_class"],
  premium: number,
): COEResult => ({
  month: "2024-01",
  bidding_no: 1,
  vehicle_class,
  quota: 100,
  bids_success: 80,
  bids_received: 120,
  premium,
});

const setDocumentReferrer = (value: string) => {
  Object.defineProperty(document, "referrer", {
    value,
    configurable: true,
  });
};

describe("Site shell components", () => {
  beforeEach(() => {
    announcementsFixture.length = 0;
    mockPathname = "/";
    mockUseMaintenance.mockClear();
    mockStoreState.bannerContent = null;
    mockStoreState.setBannerContent.mockClear();
    setDocumentReferrer("");
  });

  afterAll(() => {
    global.fetch = originalFetch;
    Object.defineProperty(window.navigator, "sendBeacon", {
      value: originalSendBeacon,
      configurable: true,
    });
  });

  describe("Analytics", () => {
    it("uses navigator.sendBeacon when available", async () => {
      const sendBeacon = vi.fn(() => true);
      Object.defineProperty(window.navigator, "sendBeacon", {
        value: sendBeacon,
        configurable: true,
      });
      mockPathname = "/cars";
      setDocumentReferrer("https://example.com");

      render(<Analytics />);

      await waitFor(() =>
        expect(sendBeacon).toHaveBeenCalledWith(
          "/api/analytics",
          JSON.stringify({
            pathname: "/cars",
            referrer: "https://example.com",
          }),
        ),
      );
    });

    it("falls back to fetch when sendBeacon is unavailable", async () => {
      Object.defineProperty(window.navigator, "sendBeacon", {
        value: undefined,
        configurable: true,
      });
      const fetchMock = vi.fn(() => Promise.resolve({ ok: true } as Response));
      global.fetch = fetchMock as typeof fetch;

      render(<Analytics />);

      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/analytics",
          expect.objectContaining({ method: "POST", keepalive: true }),
        ),
      );
    });
  });

  describe("Announcement", () => {
    it("prioritises path specific announcements", () => {
      announcementsFixture.push(
        { content: "Cars update", paths: ["/cars"] },
        { content: "Global update" },
      );
      mockPathname = "/cars/makes";

      render(<Announcement />);

      expect(screen.getByText(/Cars update/)).toBeInTheDocument();
    });

    it("falls back to global announcements", () => {
      announcementsFixture.push({ content: "Global notice" });
      mockPathname = "/unknown";

      render(<Announcement />);

      expect(screen.getByText("Global notice")).toBeInTheDocument();
    });

    it("renders nothing when configured list is empty", () => {
      const { container } = render(<Announcement />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Banner", () => {
    it("shows banner content from the store", () => {
      mockStoreState.bannerContent = (
        <span data-testid="banner-content">Hello COE</span>
      );

      render(<Banner />);

      expect(screen.getByTestId("banner-content")).toHaveTextContent(
        "Hello COE",
      );
    });

    it("returns null when no banner content is set", () => {
      mockStoreState.bannerContent = null;

      const { container } = render(<Banner />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("QuotaPremiumTicker", () => {
    const data: COEResult[] = [
      createCoeResult("Category B", 42000),
      createCoeResult("Category A", 40000),
    ];

    it("populates the global banner with sorted categories and cleans up on unmount", () => {
      const { unmount } = render(<QuotaPremiumTicker data={data} />);

      expect(mockStoreState.setBannerContent).toHaveBeenCalledTimes(1);
      const bannerNode = mockStoreState.setBannerContent.mock
        .calls[0][0] as ReactElement;
      const { getAllByText } = render(bannerNode);
      expect(getAllByText(/Category [AB]/)).toHaveLength(2);

      unmount();

      expect(mockStoreState.setBannerContent).toHaveBeenLastCalledWith(null);
    });
  });

  describe("MaintenanceNotice", () => {
    it("renders the maintenance copy and runs the hook", () => {
      render(<MaintenanceNotice />);
      expect(screen.getByText(/Pit Stop in Progress/i)).toBeInTheDocument();
      expect(mockUseMaintenance).toHaveBeenCalled();
    });
  });

  describe("Footer", () => {
    it("renders asynchronous footer content with version information", async () => {
      const footer = await Footer();
      const { getByText } = render(footer);
      expect(getByText(/All rights reserved/)).toBeInTheDocument();
      expect(getByText(/Privacy Policy/)).toBeInTheDocument();
    });
  });

  describe("PageHeader", () => {
    it("shows last updated date, month selector, and action area", () => {
      render(
        <PageHeader
          title="COE Trends"
          subtitle="Latest insights"
          lastUpdated={1704067200000}
          showMonthSelector
          months={["2024-01", "2023-12"]}
        >
          <span data-testid="extra-actions">Actions</span>
        </PageHeader>,
      );

      expect(screen.getByText("COE Trends")).toBeInTheDocument();
      expect(screen.getByText("Latest insights")).toBeInTheDocument();
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
      expect(screen.getByTestId("month-selector")).toHaveTextContent(
        "2024-01,2023-12",
      );
      expect(screen.getByTestId("extra-actions")).toBeInTheDocument();
    });
  });

  describe("StructuredData", () => {
    it("injects JSON-LD script", () => {
      const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "SG Cars Trends",
      };

      const { container } = render(<StructuredData data={data} />);
      const script = container.querySelector(
        "script#structured-data",
      ) as HTMLScriptElement;

      expect(script).toBeTruthy();
      expect(script.textContent).toContain("SG Cars Trends");
    });
  });

  describe("Misc components", () => {
    it("renders ComingSoon label", () => {
      render(
        <ComingSoon>
          <span>Trends</span>
        </ComingSoon>,
      );

      expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    });

    it("renders Progress content", () => {
      render(<Progress value={0.5}>50%</Progress>);
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("renders TrendsComparisonBottomSheet content when open", () => {
      const handleChange = vi.fn();
      render(
        <TrendsComparisonBottomSheet isOpen onOpenChange={handleChange} />,
      );

      expect(screen.getByText("Trends Comparison")).toBeInTheDocument();
    });
  });

  describe("MetricsComparison", () => {
    it("indicates positive growth", () => {
      render(<MetricsComparison current={110} previousMonth={100} />);
      expect(screen.getByText("vs last month")).toBeInTheDocument();
      expect(screen.getByText("10%")).toBeInTheDocument();
    });

    it("indicates negative growth", () => {
      render(<MetricsComparison current={90} previousMonth={100} />);
      expect(screen.getByText("vs last month")).toBeInTheDocument();
      expect(screen.getByText("10%")).toBeInTheDocument();
    });
  });

  describe("MetricCard", () => {
    it("combines metric value and comparison", () => {
      render(
        <MetricCard
          title="COE Premiums"
          value={50000}
          current={50000}
          previousMonth={45000}
        />,
      );

      expect(screen.getByText("COE Premiums")).toBeInTheDocument();
      expect(screen.getByText("vs last month")).toBeInTheDocument();
    });
  });
});
