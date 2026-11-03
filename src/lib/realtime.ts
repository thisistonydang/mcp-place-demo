import { createRealtimeClient } from "@neon/realtime/client";
import { drizzleParsers } from "@neon/realtime-drizzle/client";

import { readClientEnv } from "../../env";
import type { CanvasSquare } from "../../db/schema";
import type { SealedLiveQuery } from "@neon/realtime/client";

const { VITE_NEON_FUNCTION_API_BASE_URL, VITE_NEON_REALTIME_URL } =
  readClientEnv();

export const realtimeClient = createRealtimeClient({
  url: VITE_NEON_REALTIME_URL,
  parsers: { ...drizzleParsers },
});

export async function fetchSealedCanvasQuery(): Promise<
  SealedLiveQuery<CanvasSquare>
> {
  const response = await fetch(
    new URL("canvas/live", VITE_NEON_FUNCTION_API_BASE_URL),
    {
      method: "POST",
    },
  );
  if (!response.ok) {
    throw new Error(`Could not fetch the canvas query (${response.status}).`);
  }
  return response.json();
}
