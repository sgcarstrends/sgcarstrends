import { Card, CardBody, CardHeader } from "@heroui/card";
import { MagicLinkForm } from "./components/magic-link-form";

export default function PartnerLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-default-50 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-2 pb-0">
          <h1 className="font-semibold text-xl">Partner Sign In</h1>
          <p className="text-default-500 text-sm">
            Enter your email to receive a sign-in link
          </p>
        </CardHeader>
        <CardBody>
          <MagicLinkForm />
        </CardBody>
      </Card>
      <p className="text-center text-default-400 text-xs">
        Advertising partners only
      </p>
    </div>
  );
}
