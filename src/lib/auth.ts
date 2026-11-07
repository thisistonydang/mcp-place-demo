import { createAuthClient } from "@neon/auth";
import { BetterAuthReactAdapter } from "@neon/auth/react/adapters";

import { readClientEnv } from "../../env";

const { VITE_NEON_AUTH_URL } = readClientEnv();

export const authClient = createAuthClient(VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
});
