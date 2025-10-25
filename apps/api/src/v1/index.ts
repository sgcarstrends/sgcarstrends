import { carsRoutes } from "@api/features/cars";
import { coeRoutes } from "@api/features/coe";
import { monthsRoutes } from "@api/features/months";
import { OpenAPIHono } from "@hono/zod-openapi";
import { bearerAuth } from "hono/bearer-auth";

const app = new OpenAPIHono();

// Protected routes (bearer token required)
app.use(bearerAuth({ token: process.env.SG_CARS_TRENDS_API_TOKEN as string }));

app.route("/cars", carsRoutes);
app.route("/coe", coeRoutes);
app.route("/months", monthsRoutes);

export default app;
