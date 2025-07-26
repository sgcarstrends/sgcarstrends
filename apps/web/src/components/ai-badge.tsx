import { Sparkles } from "lucide-react";
import { Badge } from "@web/components/ui/badge";

interface AIBadgeProps {
  modelName: string;
  className?: string;
}

export const AIBadge = ({ modelName, className = "" }: AIBadgeProps) => (
  <Badge
    variant="secondary"
    className={`border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-xs text-blue-800 ${className}`}
  >
    <Sparkles className="mr-1 h-3 w-3" />
    {modelName}
  </Badge>
);
