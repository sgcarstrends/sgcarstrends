import { Card, CardBody, CardHeader } from "@heroui/card";
import { auth } from "@web/app/admin/lib/auth";
import Typography from "@web/components/typography";
import { CreditCard } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography.H1>Billing</Typography.H1>
        <Typography.TextSm>Manage your subscription and payments</Typography.TextSm>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-col items-start gap-2">
          <Typography.H4>Payment Integration</Typography.H4>
          <Typography.TextSm>Coming soon</Typography.TextSm>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-default-100">
              <CreditCard className="size-8 text-default-400" />
            </div>
            <div className="flex flex-col gap-2">
              <Typography.H4>Payment integration coming soon</Typography.H4>
              <Typography.TextSm>
                We're integrating Stripe with PayNow support for easy payments.
                <br />
                For now, contact us to discuss your advertising needs.
              </Typography.TextSm>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
