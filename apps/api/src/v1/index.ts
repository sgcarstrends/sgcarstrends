import { OpenAPIHono } from "@hono/zod-openapi";
import { bearerAuth } from "hono/bearer-auth";
import { Resource } from "sst";
import cars from "./routes/cars";
import coe from "./routes/coe";
import months from "./routes/months";

const app = new OpenAPIHono();

app.use(bearerAuth({ token: Resource.SG_CARS_TRENDS_API_TOKEN.value }));

app.route("/cars", cars);
app.route("/coe", coe);
app.route("/months", months);

export default app;
