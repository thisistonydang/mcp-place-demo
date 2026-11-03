import { sql } from "drizzle-orm";
import {
  check,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
} from "drizzle-orm/pg-core";

export const canvasColors = [
  "white",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "black",
] as const;

export const canvasColor = pgEnum("canvas_color", canvasColors);

export const canvasSquares = pgTable(
  "canvas_squares",
  {
    x: text("x").notNull(),
    y: smallint("y").notNull(),
    color: canvasColor("color").notNull().default("white"),
  },
  (table) => [
    primaryKey({ columns: [table.x, table.y] }),
    check(
      "canvas_squares_valid_x",
      sql`${table.x} in ('A', 'B', 'C', 'D', 'E')`,
    ),
    check("canvas_squares_valid_y", sql`${table.y} between 1 and 5`),
  ],
);

export type CanvasSquare = typeof canvasSquares.$inferSelect;
export type CanvasColor = (typeof canvasColors)[number];
