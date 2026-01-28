import Typography from "@web/components/typography";

export function WelcomeSection() {
  return (
    <div className="col-span-12 flex flex-col justify-center gap-2 lg:col-span-4">
      <Typography.H1 className="lg:text-6xl">Overview</Typography.H1>
    </div>
  );
}
