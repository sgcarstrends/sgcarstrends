import db from "@api/config/db";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import { COEQuerySchema, MonthsQuerySchema } from "@api/schemas";
import { zValidator } from "@hono/zod-validator";
import { coe, coePQP } from "@sgcarstrends/schema";
import { and, asc, desc, eq, gte, inArray, lte, max } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

app.get("/", zValidator("query", COEQuerySchema), async (c) => {
  const query = c.req.query();
  const { month, from, to } = query;

  const filters = [
    month && eq(coe.month, month),
    from && gte(coe.month, from),
    to && lte(coe.month, to),
  ];

  const results = await db
    .select()
    .from(coe)
    .where(and(...filters))
    .orderBy(desc(coe.month), asc(coe.bidding_no), asc(coe.vehicle_class));

  return c.json(results);
});

app.get("/months", zValidator("query", MonthsQuerySchema), async (c) => {
  const { grouped } = c.req.query();

  const months = await getUniqueMonths(coe);
  if (grouped) {
    return c.json(groupMonthsByYear(months));
  }

  return c.json(months);
});

app.get("/latest", async (c) => {
  const [{ latestMonth }] = await db
    .select({ latestMonth: max(coe.month) })
    .from(coe);
  const results = await db
    .select()
    .from(coe)
    .where(
      and(
        eq(coe.month, latestMonth),
        inArray(
          coe.bidding_no,
          db
            .select({ bidding_no: max(coe.bidding_no) })
            .from(coe)
            .where(eq(coe.month, latestMonth)),
        ),
      ),
    )
    .orderBy(desc(coe.bidding_no), asc(coe.vehicle_class));

  return c.json(results);
});

app.get("/pqp", async (c) => {
  const results = await db
    .select()
    .from(coePQP)
    .orderBy(desc(coePQP.month), asc(coePQP.vehicle_class));

  const pqpRates = results.reduce((grouped, { month, vehicle_class, pqp }) => {
    if (!grouped[month]) {
      grouped[month] = {};
    }
    grouped[month][vehicle_class] = pqp;
    return grouped;
  }, {});

  return c.json(pqpRates);
});

export default app;
