# mcp/place demo

A small 5 by 5 canvas that updates live when its Lakebase Postgres rows change.

## Run locally

```bash
pnpm install
pnpm dev
```

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

- `pnpm dev`: start the app
- `pnpm db:migrate`: apply database migrations
- `pnpm test`: run tests
- `pnpm check`: run all local checks
- `pnpm build`: create a production build
