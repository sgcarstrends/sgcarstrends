import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Typography from "@web/components/typography";
import { AlertTriangle, Calendar, Database, RefreshCw } from "lucide-react";

export function DataSourcesTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card shadow="sm">
          <CardHeader className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-primary" />
              <Typography.H4>Primary Data Source</Typography.H4>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Typography.Text>
              All vehicle registration and COE data is sourced directly from
              Singapore&apos;s{" "}
              <strong>Land Transport Authority (LTA) DataMall</strong>, the
              official government open data platform for transport-related
              datasets.
            </Typography.Text>
            <Chip size="sm" color="primary" variant="flat">
              Official Government Data
            </Chip>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardHeader className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 text-primary" />
              <Typography.H4>Update Frequency</Typography.H4>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Typography.Text>
              Data is updated <strong>monthly</strong> following LTA&apos;s
              official release schedule. New data typically becomes available
              2-3 weeks after the end of each month.
            </Typography.Text>
            <Typography.TextSm>
              COE bidding results are updated after each exercise (twice
              monthly).
            </Typography.TextSm>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardHeader className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <Typography.H4>Data Coverage</Typography.H4>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Typography.Text>
              Our dataset covers Singapore vehicle registration and COE data
              from <strong>January 2015 to present</strong>, with monthly
              granularity.
            </Typography.Text>
            <div className="flex flex-wrap gap-2">
              <Chip size="sm" variant="flat">
                Car Registrations
              </Chip>
              <Chip size="sm" variant="flat">
                COE Bidding Results
              </Chip>
              <Chip size="sm" variant="flat">
                Vehicle Deregistrations
              </Chip>
              <Chip size="sm" variant="flat">
                Vehicle Population
              </Chip>
              <Chip size="sm" variant="flat">
                PQP Rates
              </Chip>
            </div>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardHeader className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning" />
              <Typography.H4>Accuracy Disclaimer</Typography.H4>
            </div>
          </CardHeader>
          <CardBody>
            <Typography.Text>
              While we strive for accuracy, this platform is not affiliated with
              the Singapore government. Data is provided for informational
              purposes only. For official records and legal matters, please
              refer directly to LTA&apos;s official channels. Minor
              discrepancies may occur due to data processing and formatting.
            </Typography.Text>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
