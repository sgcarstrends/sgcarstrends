import { OpenAPIHono } from "@hono/zod-openapi";
import { bearerAuth } from "hono/bearer-auth";
import cars from "./routes/cars";
import coe from "./routes/coe";
import months from "./routes/months";
import newsletter from "./routes/newsletter";

const app = new OpenAPIHono();

// Public routes (no authentication required)
app.route("/newsletter", newsletter);

// Protected routes (bearer token required)
app.use(bearerAuth({ token: process.env.SG_CARS_TRENDS_API_TOKEN as string }));

app.route("/cars", cars);
app.route("/coe", coe);
app.route("/months", months);

export default app;
