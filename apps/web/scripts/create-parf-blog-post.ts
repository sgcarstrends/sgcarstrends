/**
 * One-off script to insert a blog post about the Budget 2026 PARF rebate changes.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npx tsx apps/web/scripts/create-parf-blog-post.ts
 *
 * Uses direct db.insert() instead of savePost() because the AI package
 * constrains dataType to "cars" | "coe", and this post uses "policy".
 */

import { db, posts } from "@sgcarstrends/database";
import { slugify } from "@sgcarstrends/utils";

const title = "Budget 2026: What the PARF Rebate Changes Mean for Car Owners";
const slug = slugify(title);

const excerpt =
  "Singapore Budget 2026 slashed PARF rebates by 45 percentage points and halved the cap from $60,000 to $30,000. Here's what changed and how it affects vehicle owners.";

const content = `The Singapore Budget 2026, announced on 12 February 2026, introduced sweeping changes to the Preferential Additional Registration Fee (PARF) rebate system. These changes took effect from the 2nd COE bidding exercise in February 2026, marking the most significant overhaul of the PARF framework since its introduction.

## What Changed

The government reduced PARF rebate percentages by **45 percentage points** across every vehicle age bracket. At the same time, the maximum rebate cap was **halved from $60,000 to $30,000**.

Here is a full comparison of the old and new rates:

| Vehicle Age at Deregistration | Old Rate | New Rate | Change |
|-------------------------------|----------|----------|--------|
| 5 years or younger | 75% | 30% | -45pp |
| More than 5 to 6 years | 70% | 25% | -45pp |
| More than 6 to 7 years | 65% | 20% | -45pp |
| More than 7 to 8 years | 60% | 15% | -45pp |
| More than 8 to 9 years | 55% | 10% | -45pp |
| More than 9 to 10 years | 50% | 5% | -45pp |
| Over 10 years | 0% | 0% | — |

## Impact on Car Owners

The financial impact depends on the Additional Registration Fee (ARF) paid at registration and the vehicle's age at deregistration.

**Example 1: Mid-range car (ARF $40,000, deregistered at 5 years)**
- Old rebate: $30,000 (75% of $40,000)
- New rebate: $12,000 (30% of $40,000)
- **Difference: $18,000 less**

**Example 2: Premium car (ARF $80,000, deregistered at 5 years)**
- Old rebate: $60,000 (75% of $80,000, capped at $60,000)
- New rebate: $24,000 (30% of $80,000)
- **Difference: $36,000 less**

**Example 3: Luxury car (ARF $150,000, deregistered at 7 years)**
- Old rebate: $60,000 (65% of $150,000 = $97,500, capped at $60,000)
- New rebate: $30,000 (20% of $150,000 = $30,000, at the new cap)
- **Difference: $30,000 less**

For vehicles with higher ARF values, the halved cap amplifies the reduction. Previously, a car with an ARF above $80,000 would hit the $60,000 ceiling. Under the new framework, the ceiling sits at $30,000 — meaning the effective rebate drops even further for expensive vehicles.

## Why the Changes Were Made

The government's rationale centres on the shift towards electric vehicles (EVs). As EVs produce zero tailpipe emissions, the original environmental justification for incentivising early vehicle deregistration has weakened. The PARF system was designed to encourage owners to scrap older, more pollutive vehicles — but with the fleet transitioning to cleaner powertrains, policymakers decided the generous rebate was no longer warranted.

## What This Means Going Forward

These changes apply to all vehicles registered with COEs obtained from the 2nd bidding exercise in February 2026 onwards. Vehicles registered before this date retain their eligibility under the old PARF schedule.

For prospective car buyers, the reduced PARF rebate effectively increases the total cost of ownership over a 10-year COE cycle. Buyers should factor the lower rebate into their financial planning, especially for higher-ARF vehicles where the impact is most pronounced.

We have added a [PARF Calculator](/cars/parf) tool to help you compare rebates under both the old and new rates. Enter your ARF amount and vehicle age to see exactly how the changes affect your situation.

## Sources

- [Revision of PARF Rebate Schedule and Cap — Land Transport Authority](https://www.lta.gov.sg/content/ltagov/en/newsroom/2026/2/news-releases/revision-parf-rebate-schedule-cap.html)
- [Example of Application of Revised PARF Rebate Schedule and Cap (Annex A)](https://www.lta.gov.sg/content/dam/ltagov/news/press/2026/260212_eg-application-revised-PARF-rebate-schedule-cap-AnnexA.pdf)
- [Budget 2026 — Ministry of Finance Singapore](https://www.mof.gov.sg/singaporebudget)`;

const highlights = [
  {
    value: "-45pp",
    label: "Rebate Rate Cut",
    detail:
      "All age brackets reduced by 45 percentage points (e.g. 75% to 30%)",
  },
  {
    value: "$30,000",
    label: "New Rebate Cap",
    detail: "Halved from the previous cap of $60,000",
  },
  {
    value: "30%",
    label: "New Top Rate",
    detail: "Maximum rebate for vehicles 5 years or younger, down from 75%",
  },
];

const tags = ["Policy", "PARF", "Budget 2026", "Cars", "Electric Vehicles"];

const heroImage =
  "https://images.unsplash.com/photo-1519043916581-33ecfdba3b1c?w=1200&h=514&fit=crop";

async function main() {
  console.log(`Inserting blog post: "${title}"`);
  console.log(`Slug: ${slug}`);
  console.log(`DataType: policy, Month: 2026-02`);

  const [post] = await db
    .insert(posts)
    .values({
      title,
      slug,
      content,
      excerpt,
      heroImage,
      tags,
      highlights,
      status: "published",
      metadata: { source: "manual", reason: "Budget 2026 PARF changes" },
      month: "2026-02",
      dataType: "policy",
      publishedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [posts.month, posts.dataType],
      set: {
        title,
        slug,
        content,
        excerpt,
        heroImage,
        tags,
        highlights,
        metadata: { source: "manual", reason: "Budget 2026 PARF changes" },
        modifiedAt: new Date(),
      },
    })
    .returning();

  console.log(`Post saved — id: ${post.id}, slug: ${post.slug}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Failed to insert blog post:", error);
  process.exit(1);
});
