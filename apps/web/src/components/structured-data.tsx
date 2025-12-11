import Script from "next/script";
import type { Thing, WithContext } from "schema-dts";

interface Props {
  data: WithContext<Thing> | WithContext<Thing>[];
}

export const StructuredData = ({ data }: Props) => (
  <Script
    id="structured-data"
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
