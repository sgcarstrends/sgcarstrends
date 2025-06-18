import { getCarsByFuelType } from "@api/lib/getCarsByFuelType";
import { OpenAPIHono } from "@hono/zod-openapi";
import { FuelType } from "@sgcarstrends/types";
import { bearerAuth } from "hono/bearer-auth";
import { Resource } from "sst";
import cars from "./routes/cars";
import coe from "./routes/coe";
import months from "./routes/months";

const app = new OpenAPIHono();

app.use(bearerAuth({ token: Resource.SG_CARS_TRENDS_API_TOKEN.value }));

app.get("/", async (c) => {
  const month = c.req.query("month");
  return c.json({ data: await getCarsByFuelType(FuelType.Petrol, month) });
});

app.route("/cars", cars);
app.route("/coe", coe);
app.route("/months", months);

export default app;
