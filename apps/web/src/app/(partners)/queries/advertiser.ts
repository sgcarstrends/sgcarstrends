import {
  advertisers,
  db,
  eq,
  type SelectAdvertiser,
} from "@sgcarstrends/database";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Get advertiser profile by user ID.
 * Uses private cache since it's user-specific data.
 */
export async function getAdvertiserByUserId(
  userId: string,
): Promise<SelectAdvertiser | undefined> {
  "use cache: private";
  cacheLife("days");
  cacheTag(`advertiser:user:${userId}`);

  return db.query.advertisers.findFirst({
    where: eq(advertisers.userId, userId),
  });
}

/**
 * Get advertiser profile by advertiser ID.
 * Uses private cache since it's user-specific data.
 */
export async function getAdvertiserById(
  id: string,
): Promise<SelectAdvertiser | undefined> {
  "use cache: private";
  cacheLife("days");
  cacheTag(`advertiser:${id}`);

  return db.query.advertisers.findFirst({
    where: eq(advertisers.id, id),
  });
}
