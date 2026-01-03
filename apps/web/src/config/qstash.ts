import { Client as QStashClient, Receiver } from "@upstash/qstash";
import { Client as WorkflowClient } from "@upstash/workflow";

const isProduction = process.env.VERCEL_ENV === "production";

export const client = new WorkflowClient({
  token: process.env.QSTASH_TOKEN as string,
  headers: getBypassHeaders(),
});

export const qstashClient = new QStashClient({
  token: process.env.QSTASH_TOKEN as string,
  headers: getBypassHeaders(),
});

export const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string,
});

export function getBypassHeaders(): Record<string, string> | undefined {
  if (isProduction || !process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    return undefined;
  }
  return {
    "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
  };
}
