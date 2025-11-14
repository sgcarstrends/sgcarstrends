---
name: analytics
description: Implement or debug analytics tracking for page views and user interactions in the web app. Use when adding new tracking events, debugging analytics issues, or updating analytics configuration.
allowed-tools: Read, Edit, Grep, Glob
---

# Analytics Integration Skill

This skill helps you implement and manage analytics tracking in `apps/web/`.

## When to Use This Skill

- Adding page view tracking
- Implementing event tracking for user interactions
- Debugging analytics data collection
- Configuring analytics providers
- Creating custom analytics dashboards
- Analyzing user behavior patterns

## Analytics Architecture

The project uses a custom analytics table in PostgreSQL for privacy-focused tracking:

```
packages/database/src/db/schema/analytics.ts
apps/web/src/actions/analytics.ts
apps/web/src/components/analytics-provider.tsx
```

## Database Schema

The analytics table tracks events:

```typescript
// packages/database/src/db/schema/analytics.ts
import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const analyticsTable = pgTable("analytics", {
  id: text("id").primaryKey(),
  event: text("event").notNull(),           // 'page_view', 'click', 'search', etc.
  path: text("path"),                        // Page path
  referrer: text("referrer"),                // Referrer URL
  metadata: jsonb("metadata"),               // Additional event data
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});
```

## Implementation Patterns

### 1. Page View Tracking

```typescript
// app/components/analytics-provider.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/actions/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;

    trackPageView({
      path: url,
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);

  return null;
}

// app/layout.tsx
import { AnalyticsProvider } from "@/components/analytics-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
```

### 2. Server Action for Tracking

```typescript
// app/actions/analytics.ts
"use server";

import { db } from "@sgcarstrends/database";
import { analyticsTable } from "@sgcarstrends/database/schema";
import { nanoid } from "nanoid";

export async function trackPageView({
  path,
  referrer,
}: {
  path: string;
  referrer?: string;
}) {
  try {
    await db.insert(analyticsTable).values({
      id: nanoid(),
      event: "page_view",
      path,
      referrer: referrer || null,
      metadata: {},
      timestamp: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Analytics tracking failed:", error);
    return { success: false };
  }
}

export async function trackEvent({
  event,
  path,
  metadata = {},
}: {
  event: string;
  path?: string;
  metadata?: Record<string, any>;
}) {
  try {
    await db.insert(analyticsTable).values({
      id: nanoid(),
      event,
      path: path || null,
      metadata,
      timestamp: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Event tracking failed:", error);
    return { success: false };
  }
}
```

### 3. Event Tracking Hook

```typescript
// app/hooks/use-analytics.ts
"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/actions/analytics";

export function useAnalytics() {
  const pathname = usePathname();

  const track = useCallback(
    (event: string, metadata?: Record<string, any>) => {
      trackEvent({
        event,
        path: pathname,
        metadata,
      });
    },
    [pathname]
  );

  return { track };
}

// Usage in component
"use client";
import { useAnalytics } from "@/hooks/use-analytics";

export function SearchForm() {
  const { track } = useAnalytics();

  function handleSearch(query: string) {
    track("search", { query, resultsCount: results.length });
  }

  return <form onSubmit={handleSearch}>...</form>;
}
```

### 4. Button Click Tracking

```typescript
"use client";

import { Button } from "@heroui/react";
import { trackEvent } from "@/actions/analytics";

export function DownloadButton({ fileId }: { fileId: string }) {
  async function handleClick() {
    await trackEvent({
      event: "download",
      metadata: { fileId, fileName: "car-data.csv" },
    });

    // Trigger download...
  }

  return <Button onPress={handleClick}>Download Data</Button>;
}
```

### 5. Form Submission Tracking

```typescript
"use client";

import { trackEvent } from "@/actions/analytics";

export function ContactForm() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await trackEvent({
      event: "form_submit",
      metadata: {
        formType: "contact",
        fields: ["name", "email", "message"],
      },
    });

    // Submit form...
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Analytics Dashboard

### Query Analytics Data

```typescript
// app/actions/analytics.ts
"use server";

import { db } from "@sgcarstrends/database";
import { analyticsTable } from "@sgcarstrends/database/schema";
import { sql, desc, eq, and, gte } from "drizzle-orm";

export async function getPageViews(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const pageViews = await db
    .select({
      path: analyticsTable.path,
      views: sql<number>`count(*)`,
    })
    .from(analyticsTable)
    .where(
      and(
        eq(analyticsTable.event, "page_view"),
        gte(analyticsTable.timestamp, startDate)
      )
    )
    .groupBy(analyticsTable.path)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  return pageViews;
}

export async function getEventCounts(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const events = await db
    .select({
      event: analyticsTable.event,
      count: sql<number>`count(*)`,
    })
    .from(analyticsTable)
    .where(gte(analyticsTable.timestamp, startDate))
    .groupBy(analyticsTable.event)
    .orderBy(desc(sql`count(*)`));

  return events;
}

export async function getDailyViews(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dailyViews = await db
    .select({
      date: sql<string>`DATE(timestamp)`,
      views: sql<number>`count(*)`,
    })
    .from(analyticsTable)
    .where(
      and(
        eq(analyticsTable.event, "page_view"),
        gte(analyticsTable.timestamp, startDate)
      )
    )
    .groupBy(sql`DATE(timestamp)`)
    .orderBy(sql`DATE(timestamp)`);

  return dailyViews;
}
```

### Analytics Dashboard Page

```typescript
// app/admin/analytics/page.tsx
import { getPageViews, getEventCounts, getDailyViews } from "@/actions/analytics";
import { Card, CardHeader, CardBody } from "@heroui/react";

export default async function AnalyticsDashboard() {
  const [pageViews, events, dailyViews] = await Promise.all([
    getPageViews(7),
    getEventCounts(7),
    getDailyViews(30),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Top Pages (Last 7 Days)</h2>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {pageViews.map((page) => (
                <li key={page.path} className="flex justify-between">
                  <span>{page.path}</span>
                  <span className="font-semibold">{page.views} views</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Event Counts */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Events (Last 7 Days)</h2>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.event} className="flex justify-between">
                  <span className="capitalize">{event.event}</span>
                  <span className="font-semibold">{event.count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Daily Views Chart */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Daily Page Views</h2>
        </CardHeader>
        <CardBody>
          {/* Integrate with chart component */}
          <DailyViewsChart data={dailyViews} />
        </CardBody>
      </Card>
    </div>
  );
}
```

## Third-Party Analytics Integration

### Google Analytics 4

```typescript
// app/components/google-analytics.tsx
"use client";

import Script from "next/script";

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}

// app/layout.tsx
import { GoogleAnalytics } from "@/components/google-analytics";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics
            measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}
        {children}
      </body>
    </html>
  );
}
```

### Vercel Analytics

```bash
pnpm -F @sgcarstrends/web add @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### PostHog Analytics

```bash
pnpm -F @sgcarstrends/web add posthog-js
```

```typescript
// app/providers/posthog-provider.tsx
"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: true,
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
```

## Privacy Considerations

### GDPR Compliance

```typescript
// app/components/cookie-consent.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
    // Enable analytics tracking
  }

  function handleDecline() {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
    // Disable analytics tracking
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p>We use cookies to improve your experience.</p>
        <div className="space-x-4">
          <Button variant="light" onPress={handleDecline}>
            Decline
          </Button>
          <Button color="primary" onPress={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### IP Anonymization

```typescript
// app/actions/analytics.ts
"use server";

import { headers } from "next/headers";

function anonymizeIP(ip: string): string {
  // Remove last octet for IPv4
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  // For IPv6, keep only first 48 bits
  return ip.split(":").slice(0, 3).join(":") + "::";
}

export async function trackPageView(data: TrackingData) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "";
  const anonymizedIP = anonymizeIP(ip);

  // Track with anonymized IP
  await db.insert(analyticsTable).values({
    ...data,
    metadata: { ...data.metadata, ip: anonymizedIP },
  });
}
```

## Testing Analytics

```typescript
// __tests__/actions/analytics.test.ts
import { describe, it, expect, vi } from "vitest";
import { trackPageView, trackEvent } from "@/actions/analytics";

vi.mock("@sgcarstrends/database", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

describe("Analytics", () => {
  it("tracks page views", async () => {
    const result = await trackPageView({
      path: "/blog",
      referrer: "https://google.com",
    });

    expect(result.success).toBe(true);
  });

  it("tracks custom events", async () => {
    const result = await trackEvent({
      event: "button_click",
      metadata: { buttonId: "download" },
    });

    expect(result.success).toBe(true);
  });
});
```

## Performance Optimization

### Batch Events

```typescript
"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/actions/analytics";

export function useBatchedAnalytics() {
  const eventsQueue = useRef<any[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const track = (event: string, metadata?: Record<string, any>) => {
    eventsQueue.current.push({ event, metadata, timestamp: Date.now() });

    // Batch events every 5 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (eventsQueue.current.length > 0) {
        // Send batch
        await fetch("/api/analytics/batch", {
          method: "POST",
          body: JSON.stringify(eventsQueue.current),
        });

        eventsQueue.current = [];
      }
    }, 5000);
  };

  return { track };
}
```

## References

- Related files:
  - `apps/web/src/actions/analytics.ts` - Analytics actions
  - `packages/database/src/db/schema/analytics.ts` - Analytics schema
  - `apps/web/src/components/analytics-provider.tsx` - Analytics provider
  - `apps/web/CLAUDE.md` - Web app documentation

## Best Practices

1. **Privacy First**: Implement cookie consent, anonymize IPs
2. **Performance**: Don't block rendering for analytics
3. **Error Handling**: Analytics failures shouldn't break the app
4. **Testing**: Test tracking in development mode
5. **Data Quality**: Validate tracked data before insertion
6. **GDPR**: Respect user privacy preferences
7. **Monitoring**: Track analytics system health
8. **Documentation**: Document all tracked events and their meaning
