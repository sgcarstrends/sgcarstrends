import { OpenAPIHono } from "@hono/zod-openapi";
import { bearerAuth } from "hono/bearer-auth";

import cars from "./routes/cars";
import coe from "./routes/coe";
import months from "./routes/months";

const app = new OpenAPIHono();

app.use(bearerAuth({ token: process.env.SG_CARS_TRENDS_API_TOKEN }));

app.route("/cars", cars);
app.route("/coe", coe);
app.route("/months", months);

export default app;
