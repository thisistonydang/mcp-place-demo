import { attachDatabasePool } from "@neon/functions";
import { createRealtime } from "@neon/realtime/server";
import { drizzleAdapter } from "@neon/realtime-drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Pool } from "pg";

import { canvasSquares } from "../../db/schema";
import { readFunctionEnv } from "../../env";

const { DATABASE_URL, NEON_REALTIME_SECRET } = readFunctionEnv();
const connectionString = DATABASE_URL.replace(
  "sslmode=require",
  "sslmode=verify-full",
);
const pool = new Pool({ connectionString, max: 5 });
pool.on("error", (error) => console.error("Database pool error", error));
attachDatabasePool(pool);

const db = drizzle(pool);
const realtime = createRealtime({
  secret: NEON_REALTIME_SECRET,
  db: new URL(DATABASE_URL).pathname.slice(1),
  adapter: drizzleAdapter(),
});

const app = new Hono();
app.use("/canvas/live", cors({ allowMethods: ["POST"], origin: "*" }));

const routes = app.post("/canvas/live", async (context) => {
  context.header("Cache-Control", "no-store");
  const query = db
    .select()
    .from(canvasSquares)
    .orderBy(canvasSquares.y, canvasSquares.x);
  return context.json(await realtime.seal({ query }));
});

routes.onError((error, context) => {
  console.error("Canvas API request failed", error);
  return context.json({ error: "Canvas API request failed" }, 500);
});

export default routes;
