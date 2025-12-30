import Script from "next/script";
import type { Thing, WithContext } from "schema-dts";

interface Props {
  data: WithContext<Thing> | WithContext<Thing>[];
}

export function StructuredData({ data }: Props) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
