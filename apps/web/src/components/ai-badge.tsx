import { Chip } from "@heroui/chip";
import { Sparkles } from "lucide-react";

export const AIBadge = () => (
  <Chip color="primary" variant="bordered">
    <div className="flex items-center gap-1">
      <Sparkles className="size-4" />
      AI Analysis
    </div>
  </Chip>
);
