import Script from "next/script";
import type { Thing, WithContext } from "schema-dts";

interface StructuredDataProps {
  data: WithContext<Thing> | WithContext<Thing>[];
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
