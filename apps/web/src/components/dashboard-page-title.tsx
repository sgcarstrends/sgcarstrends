import Typography from "@web/components/typography";

interface DashboardPageTitleProps {
  title: string;
  subtitle?: string;
}

export function DashboardPageTitle({
  title,
  subtitle,
}: DashboardPageTitleProps) {
  return (
    <div className="flex flex-col">
      <Typography.H1>{title}</Typography.H1>
      {subtitle && (
        <Typography.TextLg className="text-default-500">
          {subtitle}
        </Typography.TextLg>
      )}
    </div>
  );
}
