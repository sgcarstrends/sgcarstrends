import { UPDATER_BASE_URL } from "@updater/config";
import { client } from "@updater/config/qstash";
// import { updateCOEPQP } from "@updater/lib/updateCOEPQP";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
// import { bearerAuth } from "hono/bearer-auth";
import { showRoutes } from "hono/dev";
// import { Resource } from "sst";
import packageJson from "../package.json" assert { type: "json" };
// import { updateCOE } from "./lib/updateCOE";
// import { updateCars } from "./lib/updateCars";
import workflow from "./workflow";

const app = new Hono();

app.get("/", async (c) => {
  return c.json({
    status: "ok",
    version: packageJson.version,
  });
});

app.post("/qstash", async (c) => {
  const response = await client.trigger({
    url: `${UPDATER_BASE_URL}/workflow`,
  });

  console.log(response);

  return c.json(response);
});

app.route("/workflow", workflow);

// app.use("/process/*", bearerAuth({ token: Resource.UPDATER_API_TOKEN.value }));

// app.post("/process/cars", async (c) => {
//   const response = await updateCars();
//   return c.json(response);
// });
//
// app.post("/process/coe-result", async (c) => {
//   const response = await updateCOE();
//   return c.json(response);
// });
//
// app.post("/process/coe-pqp", async (c) => {
//   const response = await updateCOEPQP();
//   return c.json(response);
// });

showRoutes(app);

export const handler = handle(app);
