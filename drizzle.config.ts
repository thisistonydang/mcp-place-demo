import { defineConfig } from "drizzle-kit";

import { readMigrationEnv } from "./env";

const { DATABASE_URL_UNPOOLED } = readMigrationEnv();

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./db/schema.ts",
  dbCredentials: { url: DATABASE_URL_UNPOOLED },
});
