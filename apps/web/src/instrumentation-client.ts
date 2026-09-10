import posthog from "posthog-js";

if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN as string, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-01-30",
    // Temporarily autocapture and pageviews only. Every other extension is
    // switched off to keep PostHog's share of Fast Origin Transfer down while
    // the Hobby quotas recover. Session replay is the expensive one.
    disable_session_recording: true,
    disable_surveys: true,
    disable_conversations: true,
    capture_heatmaps: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_performance: { web_vitals: false, network_timing: false },
    logs: { captureConsoleLogs: false },
  });
}
