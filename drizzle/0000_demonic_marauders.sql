CREATE TYPE "public"."canvas_color" AS ENUM('white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black');--> statement-breakpoint
CREATE TABLE "canvas_squares" (
	"x" smallint NOT NULL,
	"y" smallint NOT NULL,
	"color" "canvas_color" DEFAULT 'white' NOT NULL,
	CONSTRAINT "canvas_squares_x_y_pk" PRIMARY KEY("x","y"),
	CONSTRAINT "canvas_squares_valid_x" CHECK ("canvas_squares"."x" between 0 and 4),
	CONSTRAINT "canvas_squares_valid_y" CHECK ("canvas_squares"."y" between 0 and 4)
);
--> statement-breakpoint
INSERT INTO "canvas_squares" ("x", "y", "color")
SELECT x, y, 'white'::"canvas_color"
FROM generate_series(0, 4) AS x
CROSS JOIN generate_series(0, 4) AS y
ON CONFLICT ("x", "y") DO NOTHING;
