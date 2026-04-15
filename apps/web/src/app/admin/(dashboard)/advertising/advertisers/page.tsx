import { Card, CardBody, CardHeader } from "@heroui/card";
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
import { getAllAdvertisers } from "../queries";

export default async function AdvertisersPage() {
  const advertisers = await getAllAdvertisers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography.H1>Advertisers</Typography.H1>
        <Typography.TextSm>
          All registered advertising partners
        </Typography.TextSm>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-col items-start gap-2">
          <Typography.H4>All Advertisers</Typography.H4>
          <Typography.TextSm>
            {advertisers.length} advertiser{advertisers.length !== 1 ? "s" : ""}
          </Typography.TextSm>
        </CardHeader>
        <CardBody>
          {advertisers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Typography.TextSm>No advertisers yet</Typography.TextSm>
            </div>
          ) : (
            <Table aria-label="Advertisers table" removeWrapper>
              <TableHeader>
                <TableColumn>COMPANY</TableColumn>
                <TableColumn>CONTACT</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>JOINED</TableColumn>
              </TableHeader>
              <TableBody>
                {advertisers.map((advertiser) => (
                  <TableRow key={advertiser.id}>
                    <TableCell className="font-medium">
                      {advertiser.companyName}
                    </TableCell>
                    <TableCell>{advertiser.contactName}</TableCell>
                    <TableCell className="text-default-500">
                      {advertiser.contactEmail}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={advertiser.status} />
                    </TableCell>
                    <TableCell className="text-default-500">
                      {format(advertiser.createdAt, "MMM d, yyyy")}
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

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-success-100 text-success-700",
    inactive: "bg-default-200 text-default-500",
    suspended: "bg-danger-100 text-danger-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${styles[status] || styles.active}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
