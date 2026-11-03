import { describe, expect, it } from "vitest";

import { createCanvas, squareKey } from "./canvas";

describe("canvas helpers", () => {
  it("creates all 25 squares in row order", () => {
    const canvas = createCanvas();
    expect(canvas).toHaveLength(25);
    expect(canvas[0]).toEqual({ x: "A", y: 1, color: "white" });
    expect(canvas[24]).toEqual({ x: "E", y: 5, color: "white" });
  });

  it("places database colors at their coordinates", () => {
    const canvas = createCanvas([{ x: "C", y: 4, color: "blue" }]);
    expect(
      canvas.find((square) => squareKey(square.x, square.y) === "C,4")?.color,
    ).toBe("blue");
  });
});
