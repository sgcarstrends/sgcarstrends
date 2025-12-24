import { Client } from "@upstash/workflow";

export const client = new Client({
  token: process.env.QSTASH_TOKEN as string,
});
