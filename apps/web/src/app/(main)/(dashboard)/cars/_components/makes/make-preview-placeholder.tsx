import Typography from "@web/components/typography";
import { Car, MousePointerClick } from "lucide-react";

export function MakePreviewPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="relative">
        {/* Main icon container */}
        <div className="relative flex size-24 items-center justify-center rounded-2xl bg-default-100">
          <Car className="size-12 text-default-300" strokeWidth={1.5} />
        </div>

        {/* Floating action indicator */}
        <div className="-right-2 -bottom-2 absolute flex size-8 items-center justify-center rounded-full bg-primary">
          <MousePointerClick className="size-4 text-primary-foreground" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Typography.H3>Select a Make</Typography.H3>
        <Typography.TextSm className="max-w-[220px]">
          Choose a car brand from the grid to view registration stats, trends,
          and COE analysis
        </Typography.TextSm>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 text-default-400">
          <div className="h-px w-12 bg-default-200" />
          <Typography.Caption className="uppercase tracking-widest">
            or search
          </Typography.Caption>
          <div className="h-px w-12 bg-default-200" />
        </div>

        {/* Visual hint for search */}
        <div className="mx-auto flex items-center gap-2 rounded-full border border-default-200 border-dashed px-4 py-2">
          <Typography.Caption>Type to search makes...</Typography.Caption>
        </div>
      </div>
    </div>
  );
}
