import type { CanvasColor, CanvasSquare } from "../../db/schema";

export const GRID_SIZE = 5;
export const X_AXIS = ["A", "B", "C", "D", "E"] as const;
export const Y_AXIS = Array.from(
  { length: GRID_SIZE },
  (_, index) => index + 1,
);

export const COLOR_VALUES: Record<CanvasColor, string> = {
  white: "#ffffff",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#facc15",
  green: "#22c55e",
  blue: "#3b82f6",
  purple: "#a855f7",
  black: "#18181b",
};

export function squareKey(x: string, y: number) {
  return `${x},${y}`;
}

export function createCanvas(squares: ReadonlyArray<CanvasSquare> = []) {
  const colors = new Map(
    squares.map((square) => [squareKey(square.x, square.y), square.color]),
  );
  return Y_AXIS.flatMap((y) =>
    X_AXIS.map((x) => ({
      x,
      y,
      color: colors.get(squareKey(x, y)) ?? "white",
    })),
  );
}
