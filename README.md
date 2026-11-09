# mcp/place demo

A small 5 by 5 canvas that updates live when its Lakebase Postgres rows change.

## Run locally

```bash
pnpm install
pnpm dev
```

## Connect to the MCP server

Start the frontend locally so Neon Auth can open its sign-in and consent pages:

```bash
pnpm dev
```

Connect an MCP client to the deployed Neon Function:

```text
https://br-cool-moon-bd54o1fy-mcp.compute.c-8.us-east-2.aws.neon.tech/mcp
```

The MCP server uses Neon Managed Better Auth for OAuth. It opens the local sign-in and consent pages at `http://localhost:3000` and exposes the `paint_square` tool.

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
