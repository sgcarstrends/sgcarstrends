import { Card, CardBody, CardHeader } from "@heroui/card";
import { auth } from "@web/app/admin/lib/auth";
import { getAdvertiserByUserId } from "@web/app/partners/queries/advertiser";
import Typography from "@web/components/typography";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AccountSettingsForm } from "./components/account-settings-form";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const advertiser = await getAdvertiserByUserId(session.user.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography.H1>Settings</Typography.H1>
        <Typography.TextSm>Manage your account settings</Typography.TextSm>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-col items-start gap-2">
          <Typography.H4>Company Profile</Typography.H4>
          <Typography.TextSm>
            {advertiser
              ? "Update your company information"
              : "Complete your profile to start advertising"}
          </Typography.TextSm>
        </CardHeader>
        <CardBody>
          <AccountSettingsForm
            advertiser={advertiser}
            userEmail={session.user.email || ""}
          />
        </CardBody>
      </Card>
    </div>
  );
}
