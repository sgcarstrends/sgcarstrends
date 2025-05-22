import { carsWorkflow } from "@updater/lib/workflows/cars";
import { coeWorkflow } from "@updater/lib/workflows/coe";
import { serveMany } from "@upstash/workflow/hono";
import { Hono } from "hono";

const app = new Hono();

app.post(
  "/*",
  serveMany({
    cars: carsWorkflow,
    coe: coeWorkflow,
  }),
);

export default app;
