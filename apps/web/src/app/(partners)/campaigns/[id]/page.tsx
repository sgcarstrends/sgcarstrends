import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { auth } from "@web/app/admin/lib/auth";
import { getAdvertiserByUserId } from "@web/app/(partners)/queries/advertiser";
import {
  getCampaignById,
  getCampaignEvents,
} from "@web/app/(partners)/queries/campaigns";
import Typography from "@web/components/typography";
import { format } from "date-fns";
import { ArrowLeft, Eye, MousePointerClick, Percent } from "lucide-react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CampaignActions } from "./components/campaign-actions";
import { PerformanceChart } from "./components/performance-chart";

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const advertiser = await getAdvertiserByUserId(session.user.id);

  if (!advertiser) {
    redirect("/settings");
  }

  const campaign = await getCampaignById(id);

  if (!campaign || campaign.advertiserId !== advertiser.id) {
    notFound();
  }

  const events = await getCampaignEvents(id);

  const ctr =
    campaign.impressions > 0
      ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
      : "0.00";

  const metrics = [
    {
      label: "Impressions",
      value: campaign.impressions.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Clicks",
      value: campaign.clicks.toLocaleString(),
      icon: MousePointerClick,
    },
    {
      label: "CTR",
      value: `${ctr}%`,
      icon: Percent,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/campaigns" className="text-default-500 hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col gap-1">
            <Typography.H1>{campaign.name}</Typography.H1>
            <div className="flex items-center gap-3">
              <CampaignStatusChip status={campaign.status} />
              <Typography.TextSm>
                {format(campaign.startDate, "MMM d, yyyy")} -{" "}
                {format(campaign.endDate, "MMM d, yyyy")}
              </Typography.TextSm>
            </div>
          </div>
          <CampaignActions campaignId={id} status={campaign.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-2xl">
            <CardBody className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-default-500">
                <metric.icon className="size-4" />
                <Typography.TextSm>{metric.label}</Typography.TextSm>
              </div>
              <span className="font-bold text-2xl">{metric.value}</span>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-col items-start gap-2">
          <Typography.H4>Performance</Typography.H4>
          <Typography.TextSm>Daily impressions and clicks</Typography.TextSm>
        </CardHeader>
        <CardBody>
          {events.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Typography.TextSm>No performance data yet</Typography.TextSm>
              <Typography.Caption>
                Data will appear once your campaign starts receiving traffic
              </Typography.Caption>
            </div>
          ) : (
            <PerformanceChart data={events} />
          )}
        </CardBody>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-col items-start gap-2">
          <Typography.H4>Campaign Details</Typography.H4>
        </CardHeader>
        <CardBody>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-default-500 text-sm">Placement Type</dt>
              <dd className="font-medium">{formatPlacementType(campaign.placementType)}</dd>
            </div>
            <div>
              <dt className="text-default-500 text-sm">Plan</dt>
              <dd className="font-medium capitalize">{campaign.plan}</dd>
            </div>
            <div>
              <dt className="text-default-500 text-sm">Destination URL</dt>
              <dd className="font-medium">
                <a
                  href={campaign.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {campaign.destinationUrl}
                </a>
              </dd>
            </div>
            {campaign.altText && (
              <div>
                <dt className="text-default-500 text-sm">Alt Text</dt>
                <dd className="font-medium">{campaign.altText}</dd>
              </div>
            )}
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}

function formatPlacementType(type: string): string {
  const labels: Record<string, string> = {
    "floating-banner": "Floating Banner",
    "pinned-card": "Pinned Card",
    "in-feed": "In-Feed Card",
  };
  return labels[type] || type;
}

function CampaignStatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-default-100 text-default-600",
    active: "bg-success-100 text-success-700",
    paused: "bg-warning-100 text-warning-700",
    ended: "bg-default-200 text-default-500",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${styles[status] || styles.draft}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
