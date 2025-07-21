import Script from "next/script";
import type { Thing, WithContext } from "schema-dts";

interface Props<T extends Thing> {
  data: WithContext<T>;
}

export const StructuredData = <T extends Thing>({ data }: Props<T>) => (
  <Script
    id="structured-data"
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
