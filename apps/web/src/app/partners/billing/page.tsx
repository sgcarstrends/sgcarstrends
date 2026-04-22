import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { auth } from "@web/app/admin/lib/auth";
import { PLANS } from "@web/app/partners/lib/plans";
import Typography from "@web/components/typography";
import { Check } from "lucide-react";
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
        <Typography.TextSm>Choose a plan to start advertising</Typography.TextSm>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(PLANS).map(([key, plan]) => (
          <Card key={key} className="rounded-2xl">
            <CardHeader className="flex flex-col items-start gap-2">
              <div className="flex w-full items-center justify-between">
                <Typography.H4>{plan.name}</Typography.H4>
                {key === "growth" && (
                  <Chip color="primary" size="sm">
                    Popular
                  </Chip>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-3xl">S${plan.price}</span>
                <Typography.TextSm>/month</Typography.TextSm>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <Typography.TextSm>{plan.description}</Typography.TextSm>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-success" />
                  <Typography.TextSm>30-day campaign</Typography.TextSm>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-success" />
                  <Typography.TextSm>Performance analytics</Typography.TextSm>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-success" />
                  <Typography.TextSm>Click tracking</Typography.TextSm>
                </li>
                {key === "premium" && (
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-success" />
                    <Typography.TextSm>Priority support</Typography.TextSm>
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl bg-default-50">
        <CardBody>
          <div className="flex flex-col gap-2">
            <Typography.H4>How it works</Typography.H4>
            <Typography.TextSm>
              1. Create a campaign with your ad creative and destination URL
              <br />
              2. Select a plan and complete payment via Stripe
              <br />
              3. Your campaign goes live immediately after payment
              <br />
              4. Track performance in real-time from your dashboard
            </Typography.TextSm>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
