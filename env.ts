import { z } from "zod";

function parseEnv<T extends z.ZodType>(
  schema: T,
  source: unknown,
): z.output<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

const allowedOrigins = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.union([z.literal("*"), z.url()])).min(1));

const clientEnvSchema = z.object({
  VITE_NEON_FUNCTION_API_BASE_URL: z.url(),
  VITE_NEON_REALTIME_URL: z.url(),
});

const functionEnvSchema = z.object({
  DATABASE_URL: z.url(),
  NEON_REALTIME_SECRET: z.string().min(1),
});

const migrationEnvSchema = z.object({
  DATABASE_URL_UNPOOLED: z.url(),
});

const neonConfigEnvSchema = z.object({
  APP_ALLOWED_ORIGINS: allowedOrigins,
  NEON_REALTIME_SECRET: z.string().min(1),
});

export function readClientEnv() {
  return parseEnv(clientEnvSchema, import.meta.env);
}

export function readFunctionEnv() {
  return parseEnv(functionEnvSchema, process.env);
}

export function readMigrationEnv() {
  return parseEnv(migrationEnvSchema, process.env);
}

export function readNeonConfigEnv() {
  return parseEnv(neonConfigEnvSchema, process.env);
}
