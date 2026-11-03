import { defineConfig } from "@neon/config/v1";

import { readNeonConfigEnv } from "./env";

const { APP_ALLOWED_ORIGINS, NEON_REALTIME_SECRET } = readNeonConfigEnv();

export default defineConfig({
  functions: {
    api: {
      name: "Canvas API",
      source: "functions/api/index.ts",
      env: {
        NEON_REALTIME_SECRET,
      },
    },
  },
  preview: {
    realtime: {
      allowedOrigins: APP_ALLOWED_ORIGINS,
    },
  },
});
