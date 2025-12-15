import Typography from "@web/components/typography";
import { Car, Sparkles } from "lucide-react";

export function MakePreviewPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="relative">
        <div className="-inset-4 absolute rounded-full bg-primary/5" />
        <div className="-inset-8 absolute rounded-full bg-primary/[0.02]" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-default-100">
          <Car className="size-10 text-default-400" />
        </div>
        <div className="-right-1 -top-1 absolute rounded-full bg-background p-1">
          <Sparkles className="size-4 text-primary" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Typography.H3 className="text-default-700">
          Select a Make
        </Typography.H3>
        <Typography.TextSm className="max-w-[200px] text-default-500">
          Choose a car brand from the grid to see quick stats and details
        </Typography.TextSm>
      </div>

      <div className="flex items-center gap-2 text-default-400">
        <div className="h-px w-8 bg-default-200" />
        <span className="text-xs uppercase tracking-wider">
          or search above
        </span>
        <div className="h-px w-8 bg-default-200" />
      </div>
    </div>
  );
}
