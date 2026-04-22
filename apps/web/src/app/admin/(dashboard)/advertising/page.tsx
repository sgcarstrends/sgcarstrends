import { Card, CardBody, CardHeader } from "@heroui/card";
import Typography from "@web/components/typography";
import {
  BarChart3,
  Eye,
  Megaphone,
  MousePointerClick,
  Users,
} from "lucide-react";
import { getAdvertisingOverview } from "./queries";

export default async function AdvertisingOverviewPage() {
  const overview = await getAdvertisingOverview();

  const metrics = [
    {
      label: "Total Advertisers",
      value: overview.totalAdvertisers,
      subValue: `${overview.activeAdvertisers} active`,
      icon: Users,
    },
    {
      label: "Total Campaigns",
      value: overview.totalCampaigns,
      subValue: `${overview.activeCampaigns} active`,
      icon: Megaphone,
    },
    {
      label: "Total Impressions",
      value: overview.totalImpressions.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Total Clicks",
      value: overview.totalClicks.toLocaleString(),
      icon: MousePointerClick,
    },
  ];

  const ctr =
    overview.totalImpressions > 0
      ? ((overview.totalClicks / overview.totalImpressions) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography.H1>Advertising</Typography.H1>
        <Typography.TextSm>
          Overview of all advertising activity
        </Typography.TextSm>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-2xl">
            <CardBody className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-default-500">
                <metric.icon className="size-4" />
                <Typography.TextSm>{metric.label}</Typography.TextSm>
              </div>
              <span className="font-bold text-2xl">{metric.value}</span>
              {metric.subValue && (
                <Typography.Caption>{metric.subValue}</Typography.Caption>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-col items-start gap-2">
            <Typography.H4>Performance</Typography.H4>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-default-500 text-sm">Click-Through Rate</dt>
                <dd className="font-bold text-2xl">{ctr}%</dd>
              </div>
              <div>
                <dt className="text-default-500 text-sm">Total Revenue</dt>
                <dd className="font-bold text-2xl">
                  ${overview.totalRevenue.toLocaleString()}
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-col items-start gap-2">
            <Typography.H4>Quick Actions</Typography.H4>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2">
              <a
                href="/admin/advertising/advertisers"
                className="rounded-lg p-3 text-sm transition-colors hover:bg-default-100"
              >
                View all advertisers →
              </a>
              <a
                href="/admin/advertising/campaigns"
                className="rounded-lg p-3 text-sm transition-colors hover:bg-default-100"
              >
                View all campaigns →
              </a>
              <a
                href="/admin/advertising/preview"
                className="rounded-lg p-3 text-sm transition-colors hover:bg-default-100"
              >
                Preview ad placements →
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
