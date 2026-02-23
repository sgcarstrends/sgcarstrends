import { Card, CardBody, CardHeader } from "@heroui/card";
import Typography from "@web/components/typography";

interface GuideSection {
  title: string;
  content: string[];
}

const GUIDES: GuideSection[] = [
  {
    title: "How COE Bidding Works",
    content: [
      "The Certificate of Entitlement (COE) bidding system uses a uniform-price auction format. All successful bidders pay the same price — the lowest successful bid (known as the Quota Premium).",
      "Bidding exercises are held twice a month, typically on the first and third Wednesday, and run for three days. You can submit, modify, or withdraw your bid during this period.",
      "To bid, you must place a deposit through an authorised dealer or via the OneMotoring portal. The deposit is typically $10,000 for Category A/B/E, or $200 for Category D (motorcycles).",
      "If your bid is successful, you have six months to register a vehicle using the COE. Unused COEs are forfeited, and the deposit is not refunded.",
    ],
  },
  {
    title: "Understanding PARF Rebates",
    content: [
      "When you deregister a vehicle before its 10-year COE expires, you receive a PARF rebate — a percentage of the Additional Registration Fee (ARF) you paid at registration.",
      "The rebate percentage decreases as your vehicle ages. Under the new Budget 2026 rates: 30% for 5 years and younger, 25% for >5-6 years, 20% for >6-7 years, 15% for >7-8 years, 10% for >8-9 years, and 5% for >9-10 years.",
      "If your vehicle is over 10 years old, you receive no PARF rebate. The maximum PARF rebate is capped at $30,000 (reduced from $60,000 under Budget 2026).",
      "The PARF rebate is separate from the COE rebate, which refunds a pro-rated portion of the COE premium based on remaining validity.",
    ],
  },
  {
    title: "Reading the Charts and Data",
    content: [
      "Registration charts show the number of new vehicles registered each month, broken down by make, fuel type, or vehicle type. A rising trend suggests increased demand, while dips may indicate higher COE prices or seasonal effects.",
      "COE premium charts track the winning bid price over time for each category. Comparing Category A (smaller cars) and Category B (larger cars) can reveal shifting buyer preferences.",
      "Deregistration data shows vehicles leaving the road — whether scrapped, exported, or reaching the end of their COE. High deregistration months typically lead to more COE quotas in future exercises.",
      "Use the month selector on each page to navigate through historical data. You can compare month-on-month and year-on-year trends to identify patterns in Singapore's car market.",
    ],
  },
];

export function GuidesTab() {
  return (
    <div className="flex flex-col gap-6">
      {GUIDES.map(({ title, content }) => (
        <Card key={title} shadow="sm">
          <CardHeader className="flex flex-col items-start gap-2">
            <Typography.H3>{title}</Typography.H3>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {content.map((paragraph) => (
              <Typography.Text key={paragraph.slice(0, 40)}>
                {paragraph}
              </Typography.Text>
            ))}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
