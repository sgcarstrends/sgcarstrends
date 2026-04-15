import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { auth } from "@web/app/admin/lib/auth";
import { getAdvertiserByUserId } from "@web/app/(partners)/queries/advertiser";
import { getPartnerCampaigns } from "@web/app/(partners)/queries/campaigns";
import Typography from "@web/components/typography";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CampaignsPage() {
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

  const campaigns = await getPartnerCampaigns(advertiser.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Typography.H1>Campaigns</Typography.H1>
          <Typography.TextSm>
            Manage your advertising campaigns
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

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-col items-start gap-2">
          <Typography.H4>All Campaigns</Typography.H4>
          <Typography.TextSm>
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
          </Typography.TextSm>
        </CardHeader>
        <CardBody>
          {campaigns.length === 0 ? (
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
            <Table aria-label="Campaigns table" removeWrapper>
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>PLACEMENT</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>IMPRESSIONS</TableColumn>
                <TableColumn>CLICKS</TableColumn>
                <TableColumn>CTR</TableColumn>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const ctr =
                    campaign.impressions > 0
                      ? ((campaign.clicks / campaign.impressions) * 100).toFixed(
                          2,
                        )
                      : "0.00";

                  return (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {campaign.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-default-500">
                        {formatPlacementType(campaign.placementType)}
                      </TableCell>
                      <TableCell>
                        <CampaignStatusChip status={campaign.status} />
                      </TableCell>
                      <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                      <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                      <TableCell>{ctr}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
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
