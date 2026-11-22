# mcp/place demo

A small 5 by 5 canvas that updates live when its Lakebase Postgres rows change. Agents paint squares through an MCP server that runs on Neon Functions and signs users in with Neon Managed Better Auth.

This repo goes with the guide [Build an MCP server for your app with Neon Functions and Managed Better Auth](https://neon.com/guides/mcp-server-neon-functions).

## What you need

- A [Neon account](https://console.neon.tech/signup) and a project in AWS US East (Ohio), AWS US East (N. Virginia), AWS Europe (Frankfurt), or AWS Asia Pacific (Singapore)
- The [Neon CLI](https://neon.com/docs/cli/install), signed in with `neon login`
- Node.js and pnpm

## Set up

These steps set up the full app on your own Neon project: the canvas, sign-in, and the MCP server.

1. Install dependencies and link the repo to your Neon project:

   ```bash
   pnpm install
   neon link --project-id <project_id>
   ```

2. Turn on Neon Realtime for the branch:

   ```bash
   neon realtime enable
   ```

3. `neon.ts` reads three variables when it loads. Neon commands such as `neon env pull` and `neon deploy` fail until they're set. Export them in your shell:

   ```bash
   export NEON_REALTIME_SECRET=<realtime_secret>
   export APP_ALLOWED_ORIGINS=http://localhost:3000
   export MCP_RESOURCE=https://example.com/mcp
   ```

   - `NEON_REALTIME_SECRET`: in the Neon Console, open the branch's **Realtime** page and click **Copy secret**.
   - `APP_ALLOWED_ORIGINS`: the web origins that can subscribe to Realtime. Separate several origins with commas.
   - `MCP_RESOURCE`: the MCP function's own URL, ending in `/mcp`. You only get that URL after the first deploy, so use the placeholder for now. Step 6 replaces it.

   These exports only last for the current shell. Run them again in a new terminal.

4. Write the branch's connection details to `.env.local`, then create the `canvas_squares` table with its 25 rows:

   ```bash
   neon env pull
   pnpm db:migrate
   ```

5. Deploy to Neon. This turns on Managed Better Auth and deploys the `api` and `mcp` functions:

   ```bash
   neon deploy -y
   ```

6. Get the MCP function's URL, then deploy again with the real `MCP_RESOURCE`:

   ```bash
   neon functions get mcp
   export MCP_RESOURCE=https://<branch_id>-mcp.compute.<cell>.aws.neon.tech/mcp
   neon deploy -y
   ```

   Use the URL from `neon functions get mcp` with `/mcp` added to the end.

7. Add the frontend variables to `.env.local`:

   ```env
   VITE_NEON_AUTH_URL=<NEON_AUTH_BASE_URL from .env.local>
   VITE_NEON_FUNCTION_API_BASE_URL=<api function URL from neon functions get api>
   VITE_NEON_REALTIME_URL=<NEON_REALTIME_URL from .env.local>
   ```

8. Turn on the OAuth server and point it at the local sign-in and consent pages:

   ```bash
   neon neon-auth config oauth-server update --enabled \
     --login-page http://localhost:3000/auth/sign-in \
     --consent-page http://localhost:3000/auth/consent \
     --mcp-resource "$MCP_RESOURCE" \
     --mcp-client-id-metadata-documents
   ```

9. Start the app and open `http://localhost:3000`:

   ```bash
   pnpm dev
   ```

To check that the canvas works, change a square in the Neon SQL Editor (see [Change a square](#change-a-square)) and watch it change in the browser.

## Connect to the MCP server

Connect an MCP client to the URL in `MCP_RESOURCE`. It ends in `/mcp`. The server exposes one tool, `paint_square`.

When the client connects, it opens the sign-in and consent pages, so keep `pnpm dev` running. Create an account at `http://localhost:3000/signup` first if you don't have one.

To check the server from the command line, call it without a token. It should answer `401` with a `WWW-Authenticate` header:

```bash
curl -i "$MCP_RESOURCE"
```

Remote clients such as ChatGPT can't complete sign-in against `localhost`. To use them, deploy the frontend to a public HTTPS origin, such as Vercel, and point Managed Better Auth at it:

```bash
neon neon-auth domain add https://<your-app>.vercel.app

neon neon-auth config oauth-server update \
  --login-page https://<your-app>.vercel.app/auth/sign-in \
  --consent-page https://<your-app>.vercel.app/auth/consent
```

Set the three `VITE_` variables in your Vercel project too. See the [guide](https://neon.com/guides/mcp-server-neon-functions) for testing with MCPJam and Manufact and connecting ChatGPT.

## Change a square

Columns run from `A` through `E`, and rows run from `1` through `5`. Each database row is one square.

```sql
UPDATE canvas_squares
SET color = 'blue'
WHERE x = 'C' AND y = 3;
```

Allowed colors are `white`, `red`, `orange`, `yellow`, `green`, `blue`, `purple`, and `black`.

Reset the canvas:

```sql
UPDATE canvas_squares
SET color = 'white';
```

## Commands

- `pnpm dev`: start the local frontend and OAuth pages
- `pnpm db:migrate`: apply database migrations
- `pnpm test`: run tests
- `pnpm check`: run all local checks
- `pnpm build`: create a production build
