import { createAuthClient } from "@neon/auth";
import { BetterAuthReactAdapter } from "@neon/auth/react/adapters";

import { readClientEnv } from "../../env";

const { VITE_NEON_AUTH_URL } = readClientEnv();

export const authClient = createAuthClient(VITE_NEON_AUTH_URL);

type OAuthResult<T> = Promise<
  { data: T; error: null } | { data: null; error: { message?: string } }
>;

type OAuthProviderClient = {
  consent: (input: { accept: boolean }) => OAuthResult<{ redirect: boolean }>;
  continue: (input: { selected: boolean }) => OAuthResult<{
    redirect: boolean;
  }>;
  publicClient: (input: { query: { client_id: string } }) => OAuthResult<{
    client_name?: string;
    redirect_uris?: Array<string>;
  }>;
};

export const oauthClient = authClient as typeof authClient & {
  oauth2: OAuthProviderClient;
};

export const authReactClient = createAuthClient(VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
});
