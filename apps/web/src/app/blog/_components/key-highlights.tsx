export interface Highlight {
  value: string;
  label: string;
  detail?: string;
}

interface KeyHighlightsProps {
  highlights?: Highlight[];
}

export const KeyHighlights = ({ highlights }: KeyHighlightsProps) => {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="mb-6 font-medium text-default-400 text-sm uppercase tracking-wider">
        Key Highlights
      </h2>
      <div className="grid grid-cols-1 gap-0 border-default-200 border-t md:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="border-default-200 border-r-0 border-b p-5 last:border-r-0 md:border-r"
          >
            <div className="mb-1 font-semibold text-3xl text-primary tabular-nums md:text-4xl">
              {item.value}
            </div>
            <div className="mb-1 font-medium text-foreground text-sm">
              {item.label}
            </div>
            {item.detail && (
              <div className="text-default-500 text-xs">{item.detail}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
