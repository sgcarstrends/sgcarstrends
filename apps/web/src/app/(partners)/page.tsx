import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { auth } from "@web/app/admin/lib/auth";
import { getAdvertiserByUserId } from "@web/app/(partners)/queries/advertiser";
import { getPartnerCampaigns } from "@web/app/(partners)/queries/campaigns";
import { getPartnerDashboardData } from "@web/app/(partners)/queries/dashboard";
import Typography from "@web/components/typography";
import { BarChart3, Eye, MousePointerClick, Percent, Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PartnerDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const advertiser = await getAdvertiserByUserId(session.user.id);

  if (!advertiser) {
    return <OnboardingPrompt />;
  }

  const [dashboardData, recentCampaigns] = await Promise.all([
    getPartnerDashboardData(advertiser.id),
    getPartnerCampaigns(advertiser.id),
  ]);

  const metrics = [
    {
      label: "Total Campaigns",
      value: dashboardData.totalCampaigns,
      icon: BarChart3,
    },
    {
      label: "Active Campaigns",
      value: dashboardData.activeCampaigns,
      icon: BarChart3,
      highlight: true,
    },
    {
      label: "Total Impressions",
      value: dashboardData.totalImpressions.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Total Clicks",
      value: dashboardData.totalClicks.toLocaleString(),
      icon: MousePointerClick,
    },
    {
      label: "Click-Through Rate",
      value: `${dashboardData.clickThroughRate}%`,
      icon: Percent,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Typography.H1>Dashboard</Typography.H1>
          <Typography.TextSm>
            Welcome back, {advertiser.companyName}
          </Typography.TextSm>
        </div>
        <Link
          href="/campaigns/create"
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground text-sm"
        >
          <Plus className="size-4" />
          New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
          <Typography.H4>Recent Campaigns</Typography.H4>
          <Typography.TextSm>Your latest advertising campaigns</Typography.TextSm>
        </CardHeader>
        <CardBody>
          {recentCampaigns.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <Typography.TextSm>No campaigns yet</Typography.TextSm>
              <Link
                href="/campaigns/create"
                className="flex items-center gap-2 text-primary text-sm"
              >
                <Plus className="size-4" />
                Create your first campaign
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentCampaigns.slice(0, 5).map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-default-100"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{campaign.name}</span>
                    <span className="text-default-500 text-xs">
                      {campaign.placementType}
                    </span>
                  </div>
                  <CampaignStatusChip status={campaign.status} />
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function OnboardingPrompt() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col gap-2">
        <Typography.H2>Welcome to Partner Dashboard</Typography.H2>
        <Typography.TextSm>
          Complete your profile to start creating campaigns
        </Typography.TextSm>
      </div>
      <Link
        href="/settings"
        className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground"
      >
        Complete Profile
      </Link>
    </div>
  );
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
