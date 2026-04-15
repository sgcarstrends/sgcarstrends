import { Card, CardBody, CardHeader } from "@heroui/card";
import { auth } from "@web/app/admin/lib/auth";
import { getAdvertiserByUserId } from "@web/app/(partners)/queries/advertiser";
import Typography from "@web/components/typography";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CampaignForm } from "./components/campaign-form";

export default async function CreateCampaignPage() {
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

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography.H1>Create Campaign</Typography.H1>
        <Typography.TextSm>
          Set up your advertising campaign
        </Typography.TextSm>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-col items-start gap-2">
          <Typography.H4>Campaign Details</Typography.H4>
          <Typography.TextSm>
            Fill in the details for your new campaign
          </Typography.TextSm>
        </CardHeader>
        <CardBody>
          <CampaignForm />
        </CardBody>
      </Card>
    </div>
  );
}
