import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { attachDatabasePool } from "@neon/functions";
import { createMcpAuth } from "@neon/oauth/mcp";
import { honoMcp } from "@neon/oauth/mcp/hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Pool } from "pg";
import { z } from "zod";

import { canvasColors, canvasSquares } from "../../db/schema";
import { readMcpFunctionEnv } from "../../env";
import type { McpAuthVariables } from "@neon/oauth/mcp/hono";

const { DATABASE_URL, MCP_RESOURCE, NEON_AUTH_BASE_URL } = readMcpFunctionEnv();
const connectionString = DATABASE_URL.replace(
  "sslmode=require",
  "sslmode=verify-full",
);
const pool = new Pool({ connectionString, max: 5 });
attachDatabasePool(pool);
const db = drizzle(pool);

const mcpAuth = createMcpAuth({
  baseUrl: NEON_AUTH_BASE_URL,
  resource: MCP_RESOURCE,
});

const app = new Hono<McpAuthVariables>();
app.use(
  "/mcp",
  cors({
    allowHeaders: [
      "Authorization",
      "Content-Type",
      "Mcp-Protocol-Version",
      "Mcp-Session-Id",
    ],
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    origin: "*",
  }),
);
app.use(honoMcp(mcpAuth, { path: "/mcp" }));

app.all("/mcp", async (context) => {
  const userId = context.get("auth").sub;
  const server = createServer(userId);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  return transport.handleRequest(context.req.raw, {
    authInfo: context.get("authInfo"),
  });
});

function createServer(userId: string) {
  const server = new McpServer({ name: "mcp-place", version: "1.0.0" });

  server.registerTool(
    "paint_square",
    {
      title: "Paint a square",
      description: "Paint one square on the shared 5 by 5 mcp/place grid.",
      inputSchema: {
        color: z.enum(canvasColors).describe("The new square color."),
        x: z
          .enum(["A", "B", "C", "D", "E"])
          .describe("Grid column from A through E."),
        y: z
          .number()
          .int()
          .min(1)
          .max(5)
          .describe("Grid row from 1 through 5."),
      },
    },
    async ({ color, x, y }) => {
      const [square] = await db
        .insert(canvasSquares)
        .values({ color, x, y })
        .onConflictDoUpdate({
          target: [canvasSquares.x, canvasSquares.y],
          set: { color },
        })
        .returning();
      const result = { paintedBy: userId, square };

      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
        structuredContent: result,
      };
    },
  );

  return server;
}

app.onError((error, context) => {
  console.error("Canvas MCP request failed", error);
  return context.json({ error: "Canvas MCP request failed" }, 500);
});

export default app;
