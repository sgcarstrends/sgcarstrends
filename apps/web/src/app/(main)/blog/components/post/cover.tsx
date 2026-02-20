import { cn } from "@heroui/theme";

interface CoverProps {
  category: string;
  title?: string;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  coe: "COE",
  cars: "Cars",
};

/**
 * Abstract gradient cover with glassmorphic shapes and optional title overlay.
 * Different gradient palette and shape arrangement per category.
 */
export function Cover({ category, title, className }: CoverProps) {
  const isCoe = category === "coe";
  const label = categoryLabels[category];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        isCoe
          ? "from-[var(--chart-1)] to-[var(--chart-3)]"
          : "from-[var(--chart-2)] to-[var(--chart-5)]",
        className,
      )}
    >
      {isCoe ? (
        <>
          {/* Large sphere */}
          <div className="absolute top-1/4 left-1/4 size-24 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm" />
          {/* Medium sphere */}
          <div className="absolute top-1/3 right-1/4 size-14 rounded-full bg-white/15" />
          {/* Card shape */}
          <div className="absolute right-8 bottom-6 h-12 w-20 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm" />
          {/* Small dots */}
          <div className="absolute top-4 right-10 size-4 rounded-full bg-white/30" />
          <div className="absolute bottom-8 left-12 size-3 rounded-full bg-white/20" />
        </>
      ) : (
        <>
          {/* Main panel with data lines */}
          <div className="absolute top-6 left-8 flex h-20 w-28 flex-col gap-2 rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
            <div className="h-1.5 w-4/5 rounded-full bg-white/25" />
            <div className="h-1.5 w-3/5 rounded-full bg-white/20" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/15" />
          </div>
          {/* Secondary panel */}
          <div className="absolute right-6 bottom-6 h-14 w-20 rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm" />
          {/* Circle accent */}
          <div className="absolute top-4 right-1/4 size-10 rounded-full bg-white/20" />
          {/* Small dot */}
          <div className="absolute bottom-4 left-1/3 size-3 rounded-full bg-white/25" />
        </>
      )}

      {/* Text overlay */}
      {title && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent p-4">
          {label && (
            <span className="mb-2 w-fit rounded-full bg-white/20 px-2 py-0.5 text-white text-xs backdrop-blur-sm">
              {label}
            </span>
          )}
          <p className="line-clamp-2 font-semibold text-white leading-snug">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
