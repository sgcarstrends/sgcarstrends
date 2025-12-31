import { Receiver } from "@upstash/qstash";
import { Client } from "@upstash/workflow";

export const client = new Client({
  token: process.env.QSTASH_TOKEN as string,
});

export const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string,
});
