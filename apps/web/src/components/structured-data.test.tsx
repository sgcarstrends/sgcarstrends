import { render } from "@testing-library/react";
import { StructuredData } from "@web/components/structured-data";
import type { Organization, WithContext } from "schema-dts";
import { vi } from "vitest";

vi.mock("next/script", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <script {...props} />,
}));

describe("StructuredData", () => {
  it("should inject JSON-LD script", () => {
    const data: WithContext<Organization> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "SG Cars Trends",
    };

    const { container } = render(<StructuredData data={data} />);
    const script = container.querySelector(
      "script#structured-data",
    ) as HTMLScriptElement;

    expect(script).toBeTruthy();
    expect(script.textContent).toContain("SG Cars Trends");
  });
});
