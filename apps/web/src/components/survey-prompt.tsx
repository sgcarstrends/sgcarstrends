"use client";

import { usePathname } from "next/navigation";
import posthog, { DisplaySurveyType } from "posthog-js";
import { useEffect } from "react";

// PostHog survey "Visitor Intent", created as a draft for #1027.
export const VISITOR_INTENT_SURVEY_ID = "01a08b16-358f-0000-e30b-147c4ae4e28c";

export const SURVEY_SHOWN_AT_KEY = "motormetrics:survey-shown-at";
export const SURVEY_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000;
const SURVEY_ROUTE_PATTERN = /^\/(coe|cars)(\/|$)/;

const SURVEY_PROMPT_DELAY_MS = 10_000;

// Shows at most one survey per browser. PostHog holds the survey, its
// targeting and its responses; automatic popover display is switched off in
// instrumentation-client.ts so this component is the only display path.
export function SurveyPrompt() {
  const pathname = usePathname();

  useEffect(() => {
    if (!SURVEY_ROUTE_PATTERN.test(pathname) || isWithinCooldown()) {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      if (cancelled || !posthog.__loaded) {
        return;
      }

      const { visible } = await posthog.canRenderSurveyAsync(
        VISITOR_INTENT_SURVEY_ID,
        false,
      );
      if (cancelled || !visible) {
        return;
      }

      posthog.displaySurvey(VISITOR_INTENT_SURVEY_ID, {
        displayType: DisplaySurveyType.Popover,
        ignoreConditions: false,
        ignoreDelay: false,
      });
      rememberShown();
    }, SURVEY_PROMPT_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}

function isWithinCooldown() {
  try {
    const shownAt = Number(window.localStorage?.getItem(SURVEY_SHOWN_AT_KEY));
    return shownAt > 0 && Date.now() - shownAt < SURVEY_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function rememberShown() {
  try {
    window.localStorage?.setItem(SURVEY_SHOWN_AT_KEY, String(Date.now()));
  } catch {
    // Storage unavailable; PostHog's own 90-day wait period still applies.
  }
}
