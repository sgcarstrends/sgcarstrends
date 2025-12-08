import { render, screen } from "@testing-library/react";
import { Announcement } from "@web/components/announcement";
import { Banner } from "@web/components/banner";
import { ComingSoon } from "@web/components/coming-soon";
import { Footer } from "@web/components/footer";
import { MaintenanceNotice } from "@web/components/maintenance-notice";
import { MetricsComparison } from "@web/components/metrics-comparison";
import { PageHeader } from "@web/components/page-header";
import { PremiumBanner } from "@web/components/premium-banner";
import { Progress } from "@web/components/progress";
import { MetricCard } from "@web/components/shared/metric-card";
import { StructuredData } from "@web/components/structured-data";
import { TrendsComparison } from "@web/components/trends-comparison";
import type { Announcement as AnnouncementType, COEResult } from "@web/types";
import type { ReactElement } from "react";
import { vi } from "vitest";
import { createUseStoreMock } from "../../../tests/test-utils";

const announcementsFixture: AnnouncementType[] = [];
let mockPathname = "/";
const mockUseMaintenance = vi.fn();

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
  vehicleClass: COEResult["vehicleClass"],
  premium: number,
): COEResult => ({
  month: "2024-01",
  biddingNo: 1,
  vehicleClass,
  quota: 100,
  bidsSuccess: 80,
  bidsReceived: 120,
  premium,
});

describe("Site shell components", () => {
  beforeEach(() => {
    announcementsFixture.length = 0;
    mockPathname = "/";
    mockUseMaintenance.mockClear();
    mockStoreState.bannerContent = null;
    mockStoreState.setBannerContent.mockClear();
  });

  describe("Announcement", () => {
    it("should prioritise path-specific announcements", () => {
      announcementsFixture.push(
        { content: "Cars update", paths: ["/cars"] },
        { content: "Global update" },
      );
      mockPathname = "/cars/makes";

      render(<Announcement />);

      expect(screen.getByText(/Cars update/)).toBeInTheDocument();
    });

    it("should fall back to global announcements", () => {
      announcementsFixture.push({ content: "Global notice" });
      mockPathname = "/unknown";

      render(<Announcement />);

      expect(screen.getByText("Global notice")).toBeInTheDocument();
    });

    it("should render nothing when configured list is empty", () => {
      const { container } = render(<Announcement />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Banner", () => {
    it("should show banner content from the store", () => {
      mockStoreState.bannerContent = (
        <span data-testid="banner-content">Hello COE</span>
      );

      render(<Banner />);

      expect(screen.getByTestId("banner-content")).toHaveTextContent(
        "Hello COE",
      );
    });

    it("should return null when no banner content is set", () => {
      mockStoreState.bannerContent = null;

      const { container } = render(<Banner />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("PremiumBanner", () => {
    const data: COEResult[] = [
      createCoeResult("Category B", 42000),
      createCoeResult("Category A", 40000),
    ];

    it("should populate the global banner with sorted categories and clean up on unmount", () => {
      const { unmount } = render(<PremiumBanner data={data} />);

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
    it("should render the maintenance copy and run the hook", () => {
      render(<MaintenanceNotice />);
      expect(screen.getByText(/Pit Stop in Progress/i)).toBeInTheDocument();
      expect(mockUseMaintenance).toHaveBeenCalled();
    });
  });

  describe("Footer", () => {
    it("should render asynchronous footer content with version information", async () => {
      const footer = await Footer();
      const { getByText } = render(footer);
      expect(getByText(/All rights reserved/)).toBeInTheDocument();
      expect(getByText(/Privacy Policy/)).toBeInTheDocument();
    });
  });

  describe("PageHeader", () => {
    it("should show last updated date, month selector, and action area", () => {
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
    it("should inject JSON-LD script", () => {
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
    it("should render ComingSoon label", () => {
      render(
        <ComingSoon>
          <span>Trends</span>
        </ComingSoon>,
      );

      expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    });

    it("should render Progress content", () => {
      render(<Progress value={0.5}>50%</Progress>);
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("should render TrendsComparison content when open", () => {
      const handleChange = vi.fn();
      render(<TrendsComparison isOpen onOpenChange={handleChange} />);

      expect(screen.getByText("Trends Comparison")).toBeInTheDocument();
    });
  });

  describe("MetricsComparison", () => {
    it("should indicate positive growth", () => {
      render(<MetricsComparison current={110} previousMonth={100} />);
      expect(screen.getByText("vs last month")).toBeInTheDocument();
      expect(screen.getByText("10%")).toBeInTheDocument();
    });

    it("should indicate negative growth", () => {
      render(<MetricsComparison current={90} previousMonth={100} />);
      expect(screen.getByText("vs last month")).toBeInTheDocument();
      expect(screen.getByText("10%")).toBeInTheDocument();
    });
  });

  describe("MetricCard", () => {
    it("should combine metric value and comparison", () => {
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
