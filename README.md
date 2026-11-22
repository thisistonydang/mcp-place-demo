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

   `neon link` warns that `neon.ts` is missing `APP_ALLOWED_ORIGINS`, `MCP_RESOURCE`, and `NEON_REALTIME_SECRET`. That's expected. The link still works, and the next steps set those variables.

2. Turn on Neon Realtime for the branch, then write its secret to `.env.local`:

   ```bash
   neon realtime enable
   neon env pull -e NEON_REALTIME_SECRET
   ```

3. Add two more variables to `.env.local`:

   ```env
   APP_ALLOWED_ORIGINS=http://localhost:3000
   MCP_RESOURCE=https://example.com/mcp
   ```

   - `APP_ALLOWED_ORIGINS`: the web origins that can subscribe to Realtime. Separate several origins with commas.
   - `MCP_RESOURCE`: the MCP function's own URL, ending in `/mcp`. You only get that URL after the first deploy, so use the placeholder for now. Step 5 replaces it.

   `neon.ts` reads these variables and `NEON_REALTIME_SECRET` when it loads, so pass `--env .env.local` to `neon deploy`.

4. Deploy to Neon, then create the `canvas_squares` table with its 25 rows:

   ```bash
   neon deploy -y --env .env.local
   pnpm db:migrate
   ```

   The deploy turns on Managed Better Auth, deploys the `api` and `mcp` functions, prints their URLs, and writes the branch's connection details to `.env.local`.

5. In `.env.local`, set `MCP_RESOURCE` to the `mcp` function URL from the deploy output with `mcp` added to the end, then deploy again:

   ```env
   MCP_RESOURCE=https://<branch_id>-mcp.compute.<cell>.aws.neon.tech/mcp
   ```

   ```bash
   neon deploy -y --env .env.local
   ```

   The new deployment can take a few minutes to replace the old one. Until then, some requests still use the placeholder URL.

6. Add the frontend variables to `.env.local`:

   ```env
   VITE_NEON_AUTH_URL=<NEON_AUTH_BASE_URL from .env.local>
   VITE_NEON_FUNCTION_API_BASE_URL=<api function URL from the deploy output>
   VITE_NEON_REALTIME_URL=<NEON_REALTIME_URL from .env.local>
   ```

7. Turn on the OAuth server and point it at the local sign-in and consent pages. Use your `MCP_RESOURCE` value:

   ```bash
   neon neon-auth config oauth-server update --enabled \
     --login-page http://localhost:3000/auth/sign-in \
     --consent-page http://localhost:3000/auth/consent \
     --mcp-resource <MCP_RESOURCE>
   ```

8. Start the app and open `http://localhost:3000`:

   ```bash
   pnpm dev
   ```

   The app must run on port 3000, because the OAuth pages and `APP_ALLOWED_ORIGINS` use it. If another app has port 3000, Vite picks the next free port, and sign-in and live updates stop working. Stop the other app first.

To check that the canvas works, change a square in the Neon SQL Editor (see [Change a square](#change-a-square)) and watch it change in the browser.

## Connect to the MCP server

Connect an MCP client to your `MCP_RESOURCE` URL. It ends in `/mcp`. The server exposes one tool, `paint_square`.

When the client connects, it opens the sign-in and consent pages, so keep `pnpm dev` running. You can create an account from the sign-in page, or at `http://localhost:3000/signup`.

To check the server from the command line, call it without a token. It should answer `401` with a `WWW-Authenticate` header:

```bash
curl -i <MCP_RESOURCE>
```

Remote clients such as ChatGPT can't complete sign-in against `localhost`. To use them, deploy the frontend to a public HTTPS origin, such as Vercel, with the three `VITE_` variables set. Then point Managed Better Auth at it:

```bash
neon neon-auth domain add https://<your-app>.vercel.app

neon neon-auth config oauth-server update \
  --login-page https://<your-app>.vercel.app/auth/sign-in \
  --consent-page https://<your-app>.vercel.app/auth/consent
```

To update the grid live on that origin, add it to `APP_ALLOWED_ORIGINS`, for example `http://localhost:3000,https://<your-app>.vercel.app`, and run `neon deploy -y --env .env.local` again.

See the [guide](https://neon.com/guides/mcp-server-neon-functions) for testing with MCPJam and Manufact and connecting ChatGPT.

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
