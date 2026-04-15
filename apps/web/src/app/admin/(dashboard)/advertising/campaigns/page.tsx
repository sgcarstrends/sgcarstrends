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
import Typography from "@web/components/typography";
import { format } from "date-fns";
import { getAllCampaigns } from "../queries";

export default async function AdminCampaignsPage() {
  const campaigns = await getAllCampaigns();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography.H1>Campaigns</Typography.H1>
        <Typography.TextSm>All advertising campaigns</Typography.TextSm>
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
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Typography.TextSm>No campaigns yet</Typography.TextSm>
            </div>
          ) : (
            <Table aria-label="Campaigns table" removeWrapper>
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ADVERTISER</TableColumn>
                <TableColumn>PLACEMENT</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>IMPRESSIONS</TableColumn>
                <TableColumn>CLICKS</TableColumn>
                <TableColumn>DATES</TableColumn>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      {campaign.name}
                    </TableCell>
                    <TableCell className="text-default-500">
                      {campaign.advertiserName}
                    </TableCell>
                    <TableCell className="text-default-500">
                      {formatPlacementType(campaign.placementType)}
                    </TableCell>
                    <TableCell>
                      <CampaignStatusChip status={campaign.status} />
                    </TableCell>
                    <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-default-500 text-xs">
                      {format(campaign.startDate, "MMM d")} -{" "}
                      {format(campaign.endDate, "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
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
