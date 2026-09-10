import * as Sentry from "@sentry/nextjs";

// The OpenTelemetry provider is registered in instrumentation.ts, so Sentry
// attaches to it instead of setting up its own.
export const sentryClient = Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  skipOpenTelemetrySetup: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  includeLocalVariables: true,
  enableLogs: true,
});
