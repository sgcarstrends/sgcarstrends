import { Receiver } from "@upstash/qstash";
import { Client } from "@upstash/workflow";
import { Resource } from "sst";

export const client = new Client({ token: process.env.QSTASH_TOKEN });

export const receiver = new Receiver({
  currentSigningKey: Resource.QSTASH_CURRENT_SIGNING_KEY.value,
  nextSigningKey: Resource.QSTASH_NEXT_SIGNING_KEY.value,
});
